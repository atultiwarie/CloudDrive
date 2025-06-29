import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { uploadFile, fetchFiles, deleteFile, logoutUser } from "../api";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import BASE_URL from "../api";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Home = () => {
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [loading, setLoading] = useState({
    upload: false,
    logout: false,
    fileLoading: {},
  });

  const navigate = useNavigate();

  const getFiles = async () => {
    const data = await fetchFiles();
    setFiles(data.files);
  };

  useEffect(() => {
    if (!localStorage.getItem("isAuthenticated")) {
      navigate("/");
    } else {
      getFiles();
    }
  }, []);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return showSnackbar("Please select a file", "error");

    setLoading({ ...loading, upload: true });
    const data = await uploadFile(file);
    setLoading({ ...loading, upload: false });

    if (data.file) {
      showSnackbar("File uploaded successfully");
      getFiles();
      setShowPopup(false);
      setFile(null);
    } else {
      showSnackbar(data.error || "Upload failed", "error");
    }
  };

  const handleDelete = async (fileId) => {
    setLoading((prev) => ({
      ...prev,
      fileLoading: { ...prev.fileLoading, [fileId]: { delete: true } },
    }));

    const data = await deleteFile(fileId);

    setLoading((prev) => ({
      ...prev,
      fileLoading: { ...prev.fileLoading, [fileId]: { delete: false } },
    }));

    if (data.message === "File deleted successfully") {
      showSnackbar("File deleted successfully");
      getFiles();
    } else {
      showSnackbar("Delete failed", "error");
    }
  };

  const handleDownload = (fileId) => {
    setLoading((prev) => ({
      ...prev,
      fileLoading: { ...prev.fileLoading, [fileId]: { download: true } },
    }));

    window.location.href = `${BASE_URL}/download/${fileId}`;

    setTimeout(() => {
      setLoading((prev) => ({
        ...prev,
        fileLoading: { ...prev.fileLoading, [fileId]: { download: false } },
      }));
      showSnackbar("Download started");
    }, 500);
  };

  const handleLogout = async () => {
    setLoading({ ...loading, logout: true });
    await logoutUser();
    localStorage.removeItem("isAuthenticated");
    setLoading({ ...loading, logout: false });
    showSnackbar("Logged out successfully");
    navigate("/");
  };

  const handleCancelUpload = () => {
    setFile(null);
    setShowPopup(false);
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <main className="p-4 bg-gray-100 dark:bg-gray-800 min-h-screen w-screen">
      <div className="flex justify-between mb-4">
        <button
          onClick={() => setShowPopup(true)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
          disabled={loading.upload}
        >
          {loading.upload && <CircularProgress size={20} color="inherit" />}
          Upload File
        </button>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
          disabled={loading.logout}
        >
          {loading.logout && <CircularProgress size={20} color="inherit" />}
          Logout
        </button>
      </div>

      {showPopup && (
        <div className="pop backdrop-blur fixed top-0 left-0 h-screen w-screen flex items-center justify-center">
          <form
            onSubmit={handleUpload}
            className="bg-gray-800 p-6 rounded-lg shadow-lg"
          >
            <div className="flex items-center justify-center w-96">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    SVG, PNG, JPG or GIF (MAX. 800x400px)
                  </p>
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </label>
            </div>

            <div className="flex gap-4 mt-5">
              <button
                type="submit"
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold rounded p-2 w-full flex justify-center items-center gap-2"
                disabled={loading.upload}
              >
                {loading.upload && (
                  <CircularProgress size={20} color="inherit" />
                )}
                Upload File
              </button>

              <button
                type="button"
                onClick={handleCancelUpload}
                className="bg-red-500 hover:bg-red-700 text-white font-bold rounded p-2 w-full"
              >
                Cancel
              </button>
            </div>
          </form>

          <button
            className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 text-3xl"
            onClick={handleCancelUpload}
          >
            X
          </button>
        </div>
      )}

      <div className="files flex flex-wrap gap-4 mt-3 justify-center">
        {files.length === 0 ? (
          <p className="text-white">No files found.</p>
        ) : (
          files.map((file) => (
            <div
              key={file._id}
              className="w-96 h-96 bg-gray-300 rounded-md overflow-hidden shadow-lg flex flex-col justify-between"
            >
              <img
                src={file.path}
                alt={file.originalname}
                className="w-full h-64 object-contain mb-4 rounded bg-gray-200"
              />
              <h1 className="truncate w-full text-center px-2 mb-2">
                {file.originalname}
              </h1>
              <div className="flex justify-around items-center p-2 bg-gray-400">
                <button
                  onClick={() => handleDownload(file._id)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded flex items-center gap-2"
                  disabled={loading.fileLoading[file._id]?.download}
                >
                  {loading.fileLoading[file._id]?.download && (
                    <CircularProgress size={20} color="inherit" />
                  )}
                  Download
                </button>
                <button
                  onClick={() => handleDelete(file._id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-4 rounded flex items-center gap-2"
                  disabled={loading.fileLoading[file._id]?.delete}
                >
                  {loading.fileLoading[file._id]?.delete && (
                    <CircularProgress size={20} color="inherit" />
                  )}
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </main>
  );
};

export default Home;

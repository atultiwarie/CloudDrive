import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { uploadFile, fetchFiles, deleteFile, logoutUser } from "../api";
import CircularProgress from "@mui/material/CircularProgress";
import BASE_URL from "../api";
import Banner from "../components/Banner";
import ConfirmDialog from "../components/ConfirmDialog";

const Home = () => {
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [files, setFiles] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [filesLoading, setFilesLoading] = useState(true);
  const [confirmation, setConfirmation] = useState({
    open: false,
    action: null,
    fileId: null,
  });
  const [loading, setLoading] = useState({
    upload: false,
    logout: false,
    fileLoading: {},
  });

  const navigate = useNavigate();

  const getFiles = async () => {
    setFilesLoading(true);
    try {
      const data = await fetchFiles();
      setFiles(data.files || []);
    } catch (error) {
      showSnackbar(error.message || "Could not load files", "error");
    } finally {
      setFilesLoading(false);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("isAuthenticated")) {
      navigate("/");
    } else {
      getFiles();
    }
  }, []);

  useEffect(() => {
    return () => {
      if (filePreview) URL.revokeObjectURL(filePreview);
    };
  }, [filePreview]);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return showSnackbar("Please select a file", "error");

    setLoading((prev) => ({ ...prev, upload: true }));
    try {
      const data = await uploadFile(file);
      if (data.file) {
        showSnackbar("File uploaded successfully");
        setFiles((prev) => [data.file, ...prev]);
        setShowPopup(false);
        setFile(null);
        setFilePreview(null);
      } else {
        showSnackbar(data.error || "Upload failed", "error");
      }
    } finally {
      setLoading((prev) => ({ ...prev, upload: false }));
    }
  };

  const handleDelete = async (fileId) => {
    setLoading((prev) => ({
      ...prev,
      fileLoading: { ...prev.fileLoading, [fileId]: { delete: true } },
    }));

    try {
      const data = await deleteFile(fileId);
      if (data.message === "File deleted successfully") {
        showSnackbar("File deleted successfully");
        setFiles((prev) => prev.filter((item) => item._id !== fileId));
      } else {
        showSnackbar("Delete failed", "error");
      }
    } catch (error) {
      showSnackbar(error.message || "Delete failed", "error");
    } finally {
      setLoading((prev) => ({
        ...prev,
        fileLoading: { ...prev.fileLoading, [fileId]: { delete: false } },
      }));
    }
  };

  const requestDelete = (fileId) => {
    setConfirmation({ open: true, action: "delete", fileId });
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
    setLoading((prev) => ({ ...prev, logout: true }));
    try {
      await logoutUser();
      localStorage.removeItem("isAuthenticated");
      showSnackbar("Logged out successfully");
      navigate("/");
    } catch (error) {
      showSnackbar(error.message || "Logout failed", "error");
    } finally {
      setLoading((prev) => ({ ...prev, logout: false }));
    }
  };

  const requestLogout = () => {
    setConfirmation({ open: true, action: "logout", fileId: null });
  };

  const confirmAction = () => {
    const { action, fileId } = confirmation;
    setConfirmation({ open: false, action: null, fileId: null });
    if (action === "delete") handleDelete(fileId);
    if (action === "logout") handleLogout();
  };

  const handleCancelUpload = () => {
    setFile(null);
    setFilePreview(null);
    setShowPopup(false);
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setFilePreview(
      selectedFile.type.startsWith("image/")
        ? URL.createObjectURL(selectedFile)
        : null
    );
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
          onClick={requestLogout}
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
                  {filePreview ? (
                    <img
                      src={filePreview}
                      alt="Selected file preview"
                      className="max-h-40 max-w-full object-contain"
                    />
                  ) : (
                    <>
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span> or
                        drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        SVG, PNG, JPG or GIF (MAX. 800x400px)
                      </p>
                    </>
                  )}
                  {file && (
                    <p className="mt-2 max-w-full truncate px-4 text-sm text-gray-500 dark:text-gray-400">
                      {file.name}
                    </p>
                  )}
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
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
        {filesLoading ? (
          <CircularProgress size={40} color="inherit" />
        ) : files.length === 0 ? (
          <p className="text-white">No files found.</p>
        ) : (
          files.map((file) => (
            <div
              key={file._id}
              className="w-96 h-96 bg-gray-300 rounded-md overflow-hidden shadow-lg flex flex-col justify-between"
            >
              {file.resource_type === "image" ? (
                <img
                  src={file.path}
                  alt={file.originalname}
                  className="w-full h-64 object-contain mb-4 rounded bg-gray-200"
                />
              ) : (
                <div className="w-full h-64 mb-4 rounded bg-gray-200 flex items-center justify-center text-gray-700">
                  Preview unavailable for this file type
                </div>
              )}
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
                  onClick={() => requestDelete(file._id)}
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

      <div className="fixed top-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2">
        <Banner
          message={snackbar.open ? snackbar.message : ""}
          severity={snackbar.severity}
          onClose={handleSnackbarClose}
        />
      </div>

      <ConfirmDialog
        open={confirmation.open}
        title={
          confirmation.action === "logout"
            ? "Are you sure you want to log out?"
            : "Are you sure you want to delete this file?"
        }
        message={
          confirmation.action === "logout"
            ? "You will need to sign in again to access your files."
            : "This file will be permanently removed from your drive."
        }
        confirmLabel={
          confirmation.action === "logout" ? "Log out" : "Delete file"
        }
        onCancel={() =>
          setConfirmation({ open: false, action: null, fileId: null })
        }
        onConfirm={confirmAction}
      />
    </main>
  );
};

export default Home;

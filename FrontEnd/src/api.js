const BASE_URL = import.meta.env.VITE_API_URL;

export default BASE_URL;


export const registerUser = async (form) => {
  const res = await fetch(`${BASE_URL}/user/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form),
  });
  return res.json();
};

export const loginUser = async (form) => {
  const res = await fetch(`${BASE_URL}/user/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(form),
  });
  return res.json();
};

export const logoutUser = async () => {
  const res = await fetch(`${BASE_URL}/user/logout`, {
    method: "GET",
    credentials: "include",
  });
  return res.json();
};

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${BASE_URL}/upload-file`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  return res.json();
};

export const fetchFiles = async () => {
  const res = await fetch(`${BASE_URL}/home`, {
    method: "GET",
    credentials: "include",
  });
  return res.json();
};

export const downloadFile = (fileId) => {
  window.location.href = `${BASE_URL}/download/${fileId}`;
};

export const deleteFile = async (fileId) => {
  const res = await fetch(`${BASE_URL}/delete/${fileId}`, {
    method: "DELETE",
    credentials: "include",
  });
  return res.json();
};

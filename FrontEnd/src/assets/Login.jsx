import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api";
import CircularProgress from "@mui/material/CircularProgress";
import Banner from "../components/Banner";

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [banner, setBanner] = useState({ message: "", severity: "error" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setBanner({ message: "", severity: "error" });

    try {
      const data = await loginUser(form);
      if (data.message === "Logged In") {
        localStorage.setItem("isAuthenticated", "true");
        navigate("/home");
      } else {
        setBanner({
          message: data.message || "Login failed",
          severity: "error",
        });
      }
    } catch (error) {
      setBanner({
        message: error.message || "Login failed",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-600 px-4 py-10 text-white">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-lg bg-gray-800 p-6 shadow-2xl"
      >
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold">Login</h2>
          <p className="mt-2 text-sm text-gray-300">
            Access your CloudDrive files.
          </p>
        </div>
        <Banner
          message={banner.message}
          severity={banner.severity}
          onClose={() => setBanner({ message: "", severity: "error" })}
        />

        <label
          className="mb-2 block text-sm font-medium text-gray-200"
          htmlFor="login-username"
        >
          Username
        </label>
        <input
          id="login-username"
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
          className="mb-4 w-full rounded bg-gray-700 p-2 text-white outline-none focus:ring-2 focus:ring-blue-400"
        />

        <label
          className="mb-2 block text-sm font-medium text-gray-200"
          htmlFor="login-password"
        >
          Password
        </label>
        <input
          id="login-password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          className="mb-4 w-full rounded bg-gray-700 p-2 text-white outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          type="submit"
          className="flex w-full items-center justify-center rounded bg-green-500 p-2 font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={loading}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : "Login"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/register")}
          className="mt-3 w-full rounded bg-blue-500 p-2 font-medium text-white transition hover:bg-blue-700"
        >
          Don't have an account? Register
        </button>
      </form>
    </div>
  );
};

export default Login;

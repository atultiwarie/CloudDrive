import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api";
import CircularProgress from "@mui/material/CircularProgress";
import Banner from "../components/Banner";

const Register = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [banner, setBanner] = useState({ message: "", severity: "error" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password.length < 5) {
      setPasswordError("Password should be at least 5 characters long.");
      return;
    }

    setLoading(true);
    setBanner({ message: "", severity: "error" });

    try {
      const data = await registerUser(form);
      if (data._id) {
        setBanner({
          message: "Registration successful, please login.",
          severity: "success",
        });
        setTimeout(() => navigate("/login"), 900);
      } else {
        setBanner({
          message: data.message || "Registration failed",
          severity: "error",
        });
      }
    } catch (error) {
      setBanner({
        message: error.message || "Registration failed",
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
          <h2 className="text-2xl font-bold">Register</h2>
          <p className="mt-2 text-sm text-gray-300">
            Create your CloudDrive account.
          </p>
        </div>
        <Banner
          message={banner.message}
          severity={banner.severity}
          onClose={() => setBanner({ message: "", severity: "error" })}
        />

        <label
          className="mb-2 block text-sm font-medium text-gray-200"
          htmlFor="register-username"
        >
          Username
        </label>
        <input
          id="register-username"
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
          className="mb-4 w-full rounded bg-gray-700 p-2 text-white outline-none focus:ring-2 focus:ring-blue-400"
        />

        <label
          className="mb-2 block text-sm font-medium text-gray-200"
          htmlFor="register-email"
        >
          Email address
        </label>
        <input
          id="register-email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          className="mb-4 w-full rounded bg-gray-700 p-2 text-white outline-none focus:ring-2 focus:ring-blue-400"
        />

        <label
          className="mb-2 block text-sm font-medium text-gray-200"
          htmlFor="register-password"
        >
          Password
        </label>
        <input
          id="register-password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => {
            setForm({ ...form, password: e.target.value });

            if (e.target.value.length > 0 && e.target.value.length < 5) {
              setPasswordError(
                "Password should be at least 5 characters long.",
              );
            } else {
              setPasswordError("");
            }
          }}
          required
          className="mb-1 w-full rounded bg-gray-700 p-2 text-white outline-none focus:ring-2 focus:ring-blue-400"
        />

        {passwordError && (
          <p className="mb-2 text-sm text-red-400">{passwordError}</p>
        )}

        <button
          type="submit"
          className="mt-3 flex w-full items-center justify-center rounded bg-blue-500 p-2 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            "Register"
          )}
        </button>

        <button
          type="button"
          onClick={() => navigate("/login")}
          className="mt-3 w-full rounded bg-green-500 p-2 font-medium text-white transition hover:bg-green-700"
        >
          Already have an account? Login
        </button>
      </form>
    </div>
  );
};

export default Register;

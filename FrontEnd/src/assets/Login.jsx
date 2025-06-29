import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api";

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await loginUser(form);
    if (data.message === "Logged In") {
      localStorage.setItem("isAuthenticated", "true");
      alert("Login successful");
      navigate("/home");
    } else {
      alert(data.message || "Login failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-600 text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded-lg shadow-lg w-80"
      >
        <h2 className="text-2xl mb-4 text-center font-bold">Login</h2>

        <input
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
          className="w-full mb-3 p-2 rounded bg-gray-700 text-white"
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          className="w-full mb-3 p-2 rounded bg-gray-700 text-white"
        />

        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-700 p-2 rounded"
        >
          Login
        </button>

        <button
          type="button"
          onClick={() => navigate("/register")}
          className="w-full  bg-blue-500 hover:bg-blue-700 p-2 rounded mt-3"
        >
          Don't have an account? Register
        </button>
      </form>
    </div>
  );
};

export default Login;

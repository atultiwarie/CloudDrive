import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api";

const Register = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

  
    if (form.password.length < 5) {
      setPasswordError("Password should be at least 5 characters long.");
      return;
    }

    const data = await registerUser(form);
    if (data._id) {
      alert("Registration successful, please login.");
      navigate("/login");
    } else {
      alert(data.message || "Registration failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-600 text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded-lg shadow-lg w-80"
      >
        <h2 className="text-2xl mb-4 text-center font-bold">Register</h2>

        <input
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
          className="w-full mb-3 p-2 rounded"
        />

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          className="w-full mb-3 p-2 rounded"
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => {
            setForm({ ...form, password: e.target.value });

            if (e.target.value.length > 0 && e.target.value.length < 5) {
              setPasswordError(
                "Password should be at least 5 characters long."
              );
            } else {
              setPasswordError("");
            }
          }}
          required
          className="w-full mb-1 p-2 rounded"
        />

        {passwordError && (
          <p className="text-red-500 text-sm mb-2">{passwordError}</p>
        )}

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-700 p-2 rounded mt-3"
        >
          Register
        </button>

        <button
          type="button"
          onClick={() => navigate("/login")}
          className="w-full bg-green-500 hover:bg-green-700 p-2 rounded mt-3"
        >
          Already have an account? Login
        </button>
      </form>
    </div>
  );
};

export default Register;

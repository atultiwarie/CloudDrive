
import React from "react";
import { useNavigate } from "react-router-dom";


const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-600 flex items-center justify-center px-4">
      <main className="text-center p-8 bg-gray-100 rounded-xl shadow-2xl max-w-md w-full animate-fade-in">
        <div className="mb-6 flex justify-center">
          <img
            src="https://i.pinimg.com/736x/7e/9b/97/7e9b97d56d4bd141f76e5b3fbae132eb.jpg"
            alt="CloduDrive Logo"
            className="rounded-full w-20 h-20"
          />
        </div>

        <h1 className="text-4xl font-extrabold mb-4 text-gray-800">
          CloudDrive
        </h1>
        <p className="text-gray-600 text-lg mb-8">
          Upload. Store. Secure. Manage your files easily.
        </p>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => navigate("/login")}
            className="bg-green-600 hover:bg-green-800 text-white font-bold py-3 px-6 rounded transition duration-300 transform hover:scale-105"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded transition duration-300 transform hover:scale-105"
          >
            Register
          </button>

        </div>
      </main>
    </div>
  );
};

export default LandingPage;

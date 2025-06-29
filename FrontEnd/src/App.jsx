
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./assets/Login";
import Register from "./assets/Register";
import LandingPage from "./assets/LandingPage";
import Home from "./assets/Home";
function App() {


  return (
    <>
      <Router>
        <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </>
  );
}

export default App

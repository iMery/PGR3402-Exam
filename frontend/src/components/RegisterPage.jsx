import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styling/RegisterPage.css";
const API_URL = import.meta.env.VITE_API_BASE_URL;

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Registration failed. Username might already exist.",
        );
      }

      setMessage("User registered successfully! Redirecting to login...");
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="register-container">
      <h1 className="title">The Book Bar</h1>
      <div className="register-box">
        <h2>Register</h2>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="register-button" onClick={handleRegister}>
          Register
        </button>
        <button className="back-button" onClick={() => navigate("/")}>
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default Register;

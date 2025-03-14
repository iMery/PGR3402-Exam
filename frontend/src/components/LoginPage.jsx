import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api";
import "../styling/LoginPage.css";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await login(username, password);
      console.log("Login successful, userId stored:", data.userId);

      const role = data.role;
      console.log("User role:", role);

      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/user");
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  return (
    <div className="login-page">
      <h1 className="title">The Book Bar</h1>
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            className="login-input"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            className="login-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="login-button">
            Login
          </button>
          <button
            type="button"
            className="register-button"
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

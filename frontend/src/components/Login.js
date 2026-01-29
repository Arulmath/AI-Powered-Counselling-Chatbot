import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
  
    try {
      const response = await axios.post("http://localhost:5000/auth/login", {
        email,
        password
      });
  
      console.log("Login response:", response.data); // 🐞 Debug log
  
      if (response.data.access_token) {
        localStorage.setItem("token", response.data.access_token);
        alert("✅ Login successful!");
        navigate("/dashboard");
      } else {
        setError("Unexpected error: No token received.");
      }
    } catch (error) {
      setError(error.response?.data?.error || "Login failed. Check email and password.");
    }
  };
  
  return (
    <div className="auth-container">
      <h2>Login</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;

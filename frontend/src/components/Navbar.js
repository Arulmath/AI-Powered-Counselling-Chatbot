import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); // ✅ Check if user is logged in

  const handleLogout = () => {
    localStorage.removeItem("token"); // ✅ Remove JWT token
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/">Home</Link>

      {token ? (  // ✅ If logged in, show "Therapist" & "Logout"
        <>
          <Link to="/Chatbot">Chatbot</Link>      
          <Link to="/mypacks">Mypacks</Link>
          
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (  // ✅ If NOT logged in, show "Login" & "Signup"
        <>
          <Link to="/login">Login</Link>
          <Link to="/signup">Signup</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;

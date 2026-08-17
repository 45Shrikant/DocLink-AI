import React, { useState } from "react";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import "../styles/register.css";
import Navbar from "../components/Navbar";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

function ResetPassword() {
  const { id, token } = useParams();
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!password) {
      return toast.error("Password is required");
    } else if (password.length < 5) {
      return toast.error("Password must be at least 5 characters long");
    }

    try {
      const response = await axios.post(`/user/resetpassword/${id}/${token}`, { password });

      if (response.status === 200) {
        toast.success("Password reset successfully! Please login.");
        navigate("/login");
      } else {
        toast.error("Failed to reset password. Token may be expired.");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("Invalid or expired token. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <section className="register-section">
        <div className="register-container">
          <h2 className="form-heading">Create New Password</h2>
          <p className="form-subheading">Enter your new secure password</p>

          <form onSubmit={handleFormSubmit} className="register-form">
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="Enter new password"
              value={password}
              onChange={handlePasswordChange}
              required
            />
            <button type="submit" className="btn form-btn">
              Update Password
            </button>
          </form>

          <div className="auth-links">
            <NavLink className="login-link" to="/login">
              Back to Login
            </NavLink>
          </div>
        </div>
      </section>
    </>
  );
}

export default ResetPassword;

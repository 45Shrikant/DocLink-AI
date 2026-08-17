import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/register.css";
import Navbar from "../components/Navbar";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

function ForgotPassword() {
  const [formDetails, setFormDetails] = useState({
    email: "",
  });
  const navigate = useNavigate();

  const inputChange = (e) => {
    const { name, value } = e.target;
    setFormDetails({
      ...formDetails,
      [name]: value,
    });
  };

  const formSubmit = async (e) => {
    e.preventDefault();
    const { email } = formDetails;

    if (!email) {
      return toast.error("Email is required");
    }

    try {
      const response = await axios.post("/user/forgotpassword", { email });
      if (response.status === 200) {
        toast.success("Password reset link sent to your email!");
        navigate("/login");
      } else {
        toast.error("Failed to send password reset email");
      }
    } catch (error) {
      console.error("Error sending password reset email:", error);
      toast.error("Error sending password reset email");
    }
  };

  return (
    <>
      <Navbar />
      <section className="register-section">
        <div className="register-container">
          <h2 className="form-heading">Reset Password</h2>
          <p className="form-subheading">Enter your email and we'll send you a password reset link</p>

          <form onSubmit={formSubmit} className="register-form">
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="Enter your registered email"
              value={formDetails.email}
              onChange={inputChange}
              required
            />
            <button type="submit" className="btn form-btn">
              Send Reset Link
            </button>
          </form>

          <div className="auth-links">
            <NavLink className="login-link" to={"/login"}>
              Back to Login
            </NavLink>
          </div>
        </div>
      </section>
    </>
  );
}

export default ForgotPassword;

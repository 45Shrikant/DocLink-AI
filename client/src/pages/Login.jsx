import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/register.css";
import Navbar from "../components/Navbar";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../redux/reducers/rootSlice";
import jwt_decode from "jwt-decode";
import fetchData from "../helper/apiCall";
import { FaLock, FaEnvelope, FaUserTag } from "react-icons/fa";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

function Login() {
  const dispatch = useDispatch();
  const [formDetails, setFormDetails] = useState({
    email: "",
    password: "",
    role: "Patient", // default to Patient for convenience
  });
  const navigate = useNavigate();

  const inputChange = (e) => {
    const { name, value } = e.target;
    setFormDetails({
      ...formDetails,
      [name]: value,
    });
  };

  const handleRoleSelect = (roleName) => {
    setFormDetails({
      ...formDetails,
      role: roleName,
    });
  };

  const formSubmit = async (e) => {
    try {
      e.preventDefault();
      const { email, password, role } = formDetails;

      if (!email || !password) {
        return toast.error("Email and password are required");
      } else if (!role) {
        return toast.error("Please select a role");
      } else if (password.length < 5) {
        return toast.error("Password must be at least 5 characters long");
      }

      const { data } = await toast.promise(
        axios.post("/user/login", {
          email,
          password,
          role,
        }),
        {
          pending: "Authenticating...",
          success: "Logged in successfully!",
          error: "Unable to log in. Please check credentials.",
          loading: "Authenticating...",
        }
      );

      localStorage.setItem("token", data.token);
      dispatch(setUserInfo(jwt_decode(data.token).userId));
      getUser(jwt_decode(data.token).userId, role);
    } catch (error) {
      console.error(error);
    }
  };

  const getUser = async (id, role) => {
    try {
      const temp = await fetchData(`/user/getuser/${id}`);
      dispatch(setUserInfo(temp));
      if (role === "Admin") {
        return navigate("/dashboard/home");
      } else {
        return navigate("/");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Navbar />
      <section className="register-section">
        <div className="register-container">
          <h2 className="form-heading">Welcome Back</h2>
          <p className="form-subheading">Sign in to your DocLink-AI account</p>

          <form onSubmit={formSubmit} className="register-form">
            <div className="role-toggle-group">
              <label>Select Your Account Type</label>
              <div className="role-pills">
                {["Patient", "Doctor", "Admin"].map((r) => (
                  <button
                    key={r}
                    type="button"
                    className={`role-pill-btn ${formDetails.role === r ? "active" : ""}`}
                    onClick={() => handleRoleSelect(r)}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group-field">
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="Email address"
                value={formDetails.email}
                onChange={inputChange}
                required
              />
            </div>

            <div className="form-group-field">
              <input
                type="password"
                name="password"
                className="form-input"
                placeholder="Password"
                value={formDetails.password}
                onChange={inputChange}
                required
              />
            </div>

            <button type="submit" className="btn form-btn">
              Sign In
            </button>
          </form>

          <div className="auth-links">
            <NavLink className="login-link" to={"/forgotpassword"}>
              Forgot password?
            </NavLink>
            <p>
              Don't have an account?{" "}
              <NavLink className="login-link" to={"/register"}>
                Create an account
              </NavLink>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default Login;

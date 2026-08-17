import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/error.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaHome } from "react-icons/fa";

const Error = () => {
  return (
    <>
      <Navbar />
      <div className="error-page">
        <div className="error-code">404</div>
        <h2>Page Not Found</h2>
        <p>The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
        <NavLink to={"/"} className="btn">
          <FaHome /> Back to Homepage
        </NavLink>
      </div>
      <Footer />
    </>
  );
};

export default Error;

import React from "react";
import "../styles/footer.css";
import { FaFacebookF, FaYoutube, FaInstagram, FaTwitter, FaHeartbeat } from "react-icons/fa";
import { HashLink } from "react-router-hash-link";
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <footer>
      <div className="footer-container">
        <div className="footer-brand">
          <h3>
            <FaHeartbeat style={{ color: "#38bdf8" }} /> DocLink-AI
          </h3>
          <p>
            An intelligent medical appointment platform connecting patients with verified specialists. Empowered by AI symptom analysis and instant scheduling.
          </p>
        </div>

        <div className="footer-links">
          <h4>Navigation</h4>
          <ul>
            <li>
              <NavLink to={"/"}>Home</NavLink>
            </li>
            <li>
              <NavLink to={"/doctors"}>Find Doctors</NavLink>
            </li>
            <li>
              <HashLink to={"/#ai-consultation"}>AI Symptom Checker</HashLink>
            </li>
            <li>
              <NavLink to={"/appointments"}>Appointments</NavLink>
            </li>
            <li>
              <HashLink to={"/#contact"}>Contact Support</HashLink>
            </li>
          </ul>
        </div>

        <div className="footer-social">
          <h4>Connect With Us</h4>
          <div className="social-icons">
            <a href="https://www.facebook.com/" target="_blank" rel="noreferrer" aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href="https://www.twitter.com/" target="_blank" rel="noreferrer" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="https://www.youtube.com/" target="_blank" rel="noreferrer" aria-label="YouTube">
              <FaYoutube />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div>© {new Date().getFullYear()} DocLink-AI. All rights reserved.</div>
        <div>Built for accessible & intelligent healthcare.</div>
      </div>
    </footer>
  );
};

export default Footer;

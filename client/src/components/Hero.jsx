import React from "react";
import image from "../images/heroimg.jpg";
import "../styles/hero.css";
import { NavLink } from "react-router-dom";
import { FaCheckCircle, FaRobot, FaCalendarCheck, FaUserMd } from "react-icons/fa";

const Hero = () => {
  return (
    <section className="hero-section">
      <div className="hero">
        <div className="hero-content">
          <div className="hero-tag">
            <FaRobot /> AI-Powered Intelligent Healthcare
          </div>
          <h1>
            Your Health, <br />
            <span className="gradient-text">Our Priority</span>
          </h1>
          <p>
            Connect seamlessly with verified medical specialists. Analyze your
            symptoms instantly with our AI assistant, book appointments with real-time slot tracking, and consult securely.
          </p>

          <div className="hero-actions">
            <NavLink to={"/doctors"} className="btn">
              <FaCalendarCheck /> Book Appointment
            </NavLink>
            <a href="#ai-consultation" className="btn btn-secondary">
              <FaRobot /> Check Symptoms
            </a>
          </div>

          <div className="hero-features">
            <div className="hero-feature-item">
              <FaCheckCircle /> Verified Doctors
            </div>
            <div className="hero-feature-item">
              <FaCheckCircle /> Real-Time Slots
            </div>
            <div className="hero-feature-item">
              <FaCheckCircle /> Secure Payments
            </div>
          </div>
        </div>

        <div className="hero-img-wrapper">
          <div className="hero-img-card">
            <img src={image} alt="Healthcare specialist consultation" />
            <div className="hero-floating-badge">
              <div className="floating-icon">
                <FaUserMd />
              </div>
              <div className="floating-text">
                <h4>250+ Certified Specialists</h4>
                <p>Ready for instant consultation</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

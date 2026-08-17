import React from "react";
import image from "../images/aboutimg.jpg";
import { FaShieldAlt, FaClock, FaStethoscope, FaLock } from "react-icons/fa";

const AboutUs = () => {
  return (
    <section className="about-section">
      <div className="about">
        <div className="about-img-wrapper">
          <img src={image} alt="Medical clinic and doctor team" />
        </div>

        <div className="about-content">
          <div className="badge badge-primary" style={{ width: "fit-content" }}>
            About DocLink-AI
          </div>
          <h2>Bridging Patients & Specialists with Next-Gen Care</h2>
          <p>
            DocLink-AI simplifies healthcare discovery and appointment scheduling.
            Whether you need urgent primary care or specialized consultation, our intelligent matching engine directs you to the best qualified practitioners.
          </p>

          <div className="about-grid">
            <div className="about-card">
              <FaShieldAlt style={{ color: "var(--primary)", fontSize: "1.3rem", marginBottom: "0.5rem" }} />
              <h4>Admin-Verified Doctors</h4>
              <p>Strict credential checks ensure every physician is certified and trusted.</p>
            </div>
            <div className="about-card">
              <FaClock style={{ color: "var(--primary)", fontSize: "1.3rem", marginBottom: "0.5rem" }} />
              <h4>Instant Slot Booking</h4>
              <p>No waiting in queues. Live availability with automated confirmation alerts.</p>
            </div>
            <div className="about-card">
              <FaStethoscope style={{ color: "var(--primary)", fontSize: "1.3rem", marginBottom: "0.5rem" }} />
              <h4>AI Symptom Guidance</h4>
              <p>State-of-the-art NLP model guides you to the right department quickly.</p>
            </div>
            <div className="about-card">
              <FaLock style={{ color: "var(--primary)", fontSize: "1.3rem", marginBottom: "0.5rem" }} />
              <h4>Safe & Encrypted</h4>
              <p>Full encryption on patient records and Stripe-backed secure transactions.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;

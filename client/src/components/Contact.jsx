import React, { useState } from "react";
import "../styles/contact.css";
import { FaEnvelope, FaPaperPlane } from "react-icons/fa";
import toast from "react-hot-toast";

const Contact = () => {
  const [formDetails, setFormDetails] = useState({
    name: "",
    email: "",
    message: "",
  });

  const inputChange = (e) => {
    const { name, value } = e.target;
    return setFormDetails({
      ...formDetails,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    if (!formDetails.name || !formDetails.email || !formDetails.message) {
      e.preventDefault();
      toast.error("Please fill in all fields");
    }
  };

  return (
    <section className="contact-section" id="contact">
      <div className="contact-card">
        <div className="contact-header">
          <div className="badge badge-primary" style={{ margin: "0 auto 0.75rem" }}>
            <FaEnvelope /> Get in Touch
          </div>
          <h2>Need Help or Have Questions?</h2>
          <p>Our support team and healthcare consultants are here to assist you 24/7.</p>
        </div>

        <form
          method="POST"
          action={`https://formspree.io/f/${process.env.REACT_FORMIK_SECRET}`}
          onSubmit={handleSubmit}
          className="contact-form"
        >
          <input
            type="text"
            name="name"
            className="form-input"
            placeholder="Your Full Name"
            value={formDetails.name}
            onChange={inputChange}
            required
          />
          <input
            type="email"
            name="email"
            className="form-input"
            placeholder="Your Email Address"
            value={formDetails.email}
            onChange={inputChange}
            required
          />
          <textarea
            name="message"
            className="form-input"
            placeholder="How can we assist you?"
            value={formDetails.message}
            onChange={inputChange}
            rows="5"
            required
          ></textarea>

          <button type="submit" className="btn form-btn">
            <FaPaperPlane /> Send Message
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;

import React, { useState } from "react";
import "../styles/doctorapply.css";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaUserMd, FaPaperPlane } from "react-icons/fa";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

const ApplyDoctor = () => {
  const navigate = useNavigate();
  const [formDetails, setFormDetails] = useState({
    specialization: "",
    experience: "",
    fees: "",
  });

  const inputChange = (e) => {
    const { name, value } = e.target;
    return setFormDetails({
      ...formDetails,
      [name]: value,
    });
  };

  const btnClick = async (e) => {
    e.preventDefault();
    if (!formDetails.specialization || !formDetails.experience || !formDetails.fees) {
      return toast.error("Please fill in all medical credentials");
    }

    try {
      await toast.promise(
        axios.post(
          "/doctor/applyfordoctor",
          {
            formDetails,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        ),
        {
          success: "Doctor application submitted for admin review!",
          error: "Unable to submit doctor application",
          loading: "Submitting credentials...",
        }
      );

      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Navbar />
      <section className="doctor-apply-section">
        <div className="doctor-apply-card">
          <div className="doctor-apply-header">
            <div className="badge badge-primary" style={{ margin: "0 auto 0.75rem" }}>
              <FaUserMd /> Practitioner Verification
            </div>
            <h2>Apply as a Doctor</h2>
            <p>Join our medical network. Your application will be verified by the admin team.</p>
          </div>

          <form className="doctor-apply-form" onSubmit={btnClick}>
            <div className="form-group">
              <label>Medical Specialization *</label>
              <input
                type="text"
                name="specialization"
                className="form-input"
                placeholder="e.g. Cardiologist, Dermatologist, Neurologist"
                value={formDetails.specialization}
                onChange={inputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Years of Clinical Experience *</label>
              <input
                type="number"
                name="experience"
                className="form-input"
                placeholder="e.g. 8"
                value={formDetails.experience}
                onChange={inputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Consultation Fee ($ USD) *</label>
              <input
                type="number"
                name="fees"
                className="form-input"
                placeholder="e.g. 60"
                value={formDetails.fees}
                onChange={inputChange}
                required
              />
            </div>

            <button type="submit" className="btn form-btn">
              <FaPaperPlane /> Submit Application
            </button>
          </form>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default ApplyDoctor;

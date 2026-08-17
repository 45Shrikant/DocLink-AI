import "../styles/doctorcard.css";
import React, { useState } from "react";
import BookAppointment from "../components/BookAppointment";
import { toast } from "react-hot-toast";
import { FaCheckCircle, FaCalendarPlus, FaClock, FaDollarSign } from "react-icons/fa";

const DoctorCard = ({ ele }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const token = localStorage.getItem("token") || "";

  const handleModal = () => {
    if (!token) {
      return toast.error("Please log in to book an appointment");
    }
    setModalOpen(true);
  };

  const doctorPic =
    ele?.userId?.pic ||
    "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";

  const doctorName = `Dr. ${ele?.userId?.firstname || ""} ${ele?.userId?.lastname || ""}`.trim();

  return (
    <div className="doctor-card">
      <div className="doctor-verified-badge">
        <FaCheckCircle /> Verified
      </div>

      <div className="doctor-avatar-wrapper">
        <img src={doctorPic} alt={doctorName} className="doctor-avatar-img" />
      </div>

      <h3 className="doctor-card-name">{doctorName}</h3>
      <span className="doctor-specialty-pill">{ele?.specialization || "General Physician"}</span>

      <div className="doctor-stats-row">
        <div className="doctor-stat-item">
          <span className="stat-label">Experience</span>
          <span className="stat-value">{ele?.experience ? `${ele.experience} Yrs` : "5+ Yrs"}</span>
        </div>
        <div className="doctor-stat-item">
          <span className="stat-label">Fee</span>
          <span className="stat-value doctor-fee-highlight">${ele?.fees || 50}</span>
        </div>
      </div>

      <button className="btn doctor-book-btn" onClick={handleModal}>
        <FaCalendarPlus /> Book Appointment
      </button>

      {modalOpen && <BookAppointment setModalOpen={setModalOpen} ele={ele} />}
    </div>
  );
};

export default DoctorCard;

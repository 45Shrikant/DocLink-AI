import React, { useState } from "react";
import "../styles/bookappointment.css";
import axios from "axios";
import toast from "react-hot-toast";
import { IoMdClose } from "react-icons/io";
import { FaCalendarCheck, FaCreditCard, FaUserMd } from "react-icons/fa";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

const BookAppointment = ({ setModalOpen, ele }) => {
  const [formDetails, setFormDetails] = useState({
    date: "",
    time: "",
    age: "",
    bloodGroup: "",
    gender: "",
    number: "",
    familyDiseases: "",
  });

  const inputChange = (e) => {
    const { name, value } = e.target;
    setFormDetails({
      ...formDetails,
      [name]: value,
    });
  };

  const doctorName = `Dr. ${ele?.userId?.firstname || ""} ${ele?.userId?.lastname || ""}`.trim();
  const doctorPic =
    ele?.userId?.pic ||
    "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";

  // Handle Stripe Payment
  const handlePayment = async (e) => {
    e.preventDefault();
    if (!formDetails.date || !formDetails.time || !formDetails.number) {
      return toast.error("Please fill Date, Time, and Mobile Number");
    }

    const toastId = toast.loading("Redirecting to Stripe Payment...");
    try {
      const { data } = await axios.post("/payment/create-checkout-session", {
        doctorName: doctorName,
        price: ele?.fees || 50,
      });

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      toast.error("Payment initiation failed", { id: toastId });
      console.error(error);
    }
  };

  // Standard Appointment Booking
  const bookAppointment = async (e) => {
    e.preventDefault();
    if (!formDetails.date || !formDetails.time || !formDetails.number || !formDetails.age || !formDetails.gender) {
      return toast.error("Please fill all required fields");
    }

    try {
      await toast.promise(
        axios.post(
          "/appointment/bookappointment",
          {
            doctorId: ele?.userId?._id,
            date: formDetails.date,
            time: formDetails.time,
            age: formDetails.age,
            bloodGroup: formDetails.bloodGroup,
            gender: formDetails.gender,
            number: formDetails.number,
            familyDiseases: formDetails.familyDiseases,
            doctorname: doctorName,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        ),
        {
          success: "Appointment booked successfully!",
          error: "Unable to book appointment",
          loading: "Confirming appointment slot...",
        }
      );
      setModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setModalOpen(false)}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-doctor-info">
            <img src={doctorPic} alt={doctorName} className="modal-doc-avatar" />
            <div className="modal-doc-text">
              <h3>{doctorName}</h3>
              <p>{ele?.specialization || "Specialist"} • ${ele?.fees || 50} Consultation</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={() => setModalOpen(false)}>
            <IoMdClose />
          </button>
        </div>

        <div className="modal-body">
          <form className="booking-form">
            <div className="form-grid-2">
              <div className="form-group">
                <label>Appointment Date *</label>
                <input
                  type="date"
                  name="date"
                  className="form-input"
                  value={formDetails.date}
                  onChange={inputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Preferred Time *</label>
                <input
                  type="time"
                  name="time"
                  className="form-input"
                  value={formDetails.time}
                  onChange={inputChange}
                  required
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label>Patient Age *</label>
                <input
                  type="number"
                  name="age"
                  placeholder="e.g. 32"
                  className="form-input"
                  value={formDetails.age}
                  onChange={inputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Gender *</label>
                <select
                  name="gender"
                  className="form-input"
                  value={formDetails.gender}
                  onChange={inputChange}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label>Blood Group (Optional)</label>
                <input
                  type="text"
                  name="bloodGroup"
                  placeholder="e.g. O+, A-, B+"
                  className="form-input"
                  value={formDetails.bloodGroup}
                  onChange={inputChange}
                />
              </div>
              <div className="form-group">
                <label>Mobile Number *</label>
                <input
                  type="tel"
                  name="number"
                  placeholder="e.g. +1 234 567 8900"
                  className="form-input"
                  value={formDetails.number}
                  onChange={inputChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Medical History / Symptoms Notes</label>
              <textarea
                name="familyDiseases"
                placeholder="Mention any existing conditions, allergies, or symptoms..."
                className="form-input"
                value={formDetails.familyDiseases}
                onChange={inputChange}
                rows="3"
              ></textarea>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-book-regular"
                onClick={bookAppointment}
              >
                <FaCalendarCheck /> Book Only
              </button>

              <button
                type="button"
                className="btn btn-book-pay"
                onClick={handlePayment}
              >
                <FaCreditCard /> Pay & Book (${ele?.fees || 50})
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
import React, { useState, useEffect } from "react";
import "../styles/bookappointment.css";
import axios from "axios";
import toast from "react-hot-toast";
import { IoMdClose } from "react-icons/io";
import { FaCalendarCheck, FaCreditCard, FaSpinner } from "react-icons/fa";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Close modal on ESC key and prevent body background scrolling
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setModalOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [setModalOpen]);

  const inputChange = (e) => {
    const { name, value } = e.target;
    setFormDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const doctorUserId = ele?.userId?._id || (typeof ele?.userId === "string" ? ele?.userId : ele?._id);
  const doctorName = `Dr. ${ele?.userId?.firstname || ""} ${ele?.userId?.lastname || ""}`.trim() || "Specialist";
  const doctorPic =
    ele?.userId?.pic ||
    "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";

  // Minimum date is today
  const today = new Date().toISOString().split("T")[0];

  // Handle Stripe Payment
  const handlePayment = async (e) => {
    e.preventDefault();
    if (!formDetails.date || !formDetails.time || !formDetails.number) {
      return toast.error("Please fill Date, Time, and Mobile Number");
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Redirecting to Stripe Checkout...");
    try {
      const { data } = await axios.post("/payment/create-checkout-session", {
        doctorName: doctorName,
        price: ele?.fees || 50,
      });

      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error("Could not generate payment session", { id: toastId });
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(error.response?.data?.error || "Payment initiation failed", { id: toastId });
      setIsSubmitting(false);
    }
  };

  // Standard Appointment Booking
  const bookAppointment = async (e) => {
    e.preventDefault();
    if (!formDetails.date || !formDetails.time || !formDetails.number || !formDetails.age || !formDetails.gender) {
      return toast.error("Please fill all required fields");
    }

    if (!doctorUserId) {
      return toast.error("Invalid doctor selection. Please try again.");
    }

    const token = localStorage.getItem("token");
    if (!token) {
      return toast.error("Your session has expired. Please log in again.");
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Confirming appointment slot...");

    try {
      await axios.post(
        "/appointment/bookappointment",
        {
          doctorId: doctorUserId,
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
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Appointment booked successfully!", { id: toastId });
      setModalOpen(false);
    } catch (error) {
      console.error("Booking error:", error);
      const errorMsg = error.response?.data?.message || error.response?.data || "Unable to book appointment";
      toast.error(typeof errorMsg === "string" ? errorMsg : "Unable to book appointment", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={() => !isSubmitting && setModalOpen(false)}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-doctor-info">
            <img src={doctorPic} alt={doctorName} className="modal-doc-avatar" />
            <div className="modal-doc-text">
              <h3>{doctorName}</h3>
              <p>{ele?.specialization || "Specialist"} • ${ele?.fees || 50} Consultation</p>
            </div>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            disabled={isSubmitting}
            onClick={() => setModalOpen(false)}
          >
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
                  min={today}
                  className="form-input"
                  value={formDetails.date}
                  onChange={inputChange}
                  required
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label>Patient Age *</label>
                <input
                  type="number"
                  name="age"
                  min="1"
                  max="120"
                  placeholder="e.g. 32"
                  className="form-input"
                  value={formDetails.age}
                  onChange={inputChange}
                  required
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Medical History / Symptoms Notes (Optional)</label>
              <textarea
                name="familyDiseases"
                placeholder="Mention any existing conditions, allergies, or symptoms..."
                className="form-input"
                value={formDetails.familyDiseases}
                onChange={inputChange}
                rows="3"
                disabled={isSubmitting}
              ></textarea>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-book-regular"
                disabled={isSubmitting}
                onClick={bookAppointment}
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="spinner-icon" /> Processing...
                  </>
                ) : (
                  <>
                    <FaCalendarCheck /> Book Only
                  </>
                )}
              </button>

              <button
                type="button"
                className="btn btn-book-pay"
                disabled={isSubmitting}
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
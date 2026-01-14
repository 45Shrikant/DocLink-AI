import React, { useState } from "react";
import "../styles/bookappointment.css";
import axios from "axios";
import toast from "react-hot-toast";
import { IoMdClose } from "react-icons/io";

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
    return setFormDetails({
      ...formDetails,
      [name]: value,
    });
  };

  // --- NEW: Payment Logic ---
  const handlePayment = async (e) => {
    e.preventDefault();
    
    // 1. Basic Validation
    if (!formDetails.date || !formDetails.time || !formDetails.number) {
        return toast.error("Please fill Date, Time, and Number");
    }

    const toastId = toast.loading("Redirecting to Payment...");

    try {
      // 2. Call the Payment Endpoint we created earlier
      // Note: We are sending the doctor's name to appear on the Receipt
      const { data } = await axios.post(
        "/api/payment/create-checkout-session", 
        {
            doctorName: `${ele?.userId?.firstname} ${ele?.userId?.lastname}`,
            price: 50 // You can make this dynamic if needed
        }
      );

      // 3. Redirect user to Stripe
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      toast.error("Payment failed", { id: toastId });
      console.error(error);
    }
  };

  const bookAppointment = async (e) => {
    e.preventDefault();
    try {
      await toast.promise(
        axios.post(
          "/api/appointment/bookappointment",
          {
            doctorId: ele?.userId?._id,
            date: formDetails.date,
            time: formDetails.time,
            age: formDetails.age,
            bloodGroup: formDetails.bloodGroup,
            gender: formDetails.gender,
            number: formDetails.number,
            familyDiseases: formDetails.familyDiseases,
            doctorname: `${ele?.userId?.firstname} ${ele?.userId?.lastname}`,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        ),
        {
          success: "Appointment booked successfully",
          error: "Unable to book appointment",
          loading: "Booking appointment...",
        }
      );
      setModalOpen(false);
    } catch (error) {
      return error;
    }
  };

  return (
    <>
      <div className="modal flex-center">
        <div className="modal__content">
          <h2 className="page-heading">Book Appointment</h2>
          <IoMdClose
            onClick={() => {
              setModalOpen(false);
            }}
            className="close-btn"
          />
          <div className="register-container flex-center book">
            <form className="register-form">
              <input
                type="date"
                name="date"
                className="form-input"
                value={formDetails.date}
                onChange={inputChange}
              />
              <input
                type="time"
                name="time"
                className="form-input"
                value={formDetails.time}
                onChange={inputChange}
              />
              <input
                type="number"
                name="age"
                placeholder="Age"
                className="form-input"
                value={formDetails.age}
                onChange={inputChange}
                required
              />
              <input
                type="text"
                name="bloodGroup"
                placeholder="Blood Group (Optional)"
                className="form-input"
                value={formDetails.bloodGroup}
                onChange={inputChange}
              />
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
              <input
                type="number"
                name="number"
                placeholder="Mobile Number"
                className="form-input"
                value={formDetails.number}
                onChange={inputChange}
                required
              />
              <textarea
                name="familyDiseases"
                placeholder="Family Diseases"
                className="form-input"
                value={formDetails.familyDiseases}
                onChange={inputChange}
              ></textarea>

              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                  {/* Standard Booking Button */}
                  <button
                    type="submit"
                    className="btn form-btn"
                    onClick={bookAppointment}
                    style={{ flex: 1 }}
                  >
                    Book Only
                  </button>
                  
                  {/* NEW: Payment Button */}
                  <button
                    type="button" 
                    className="btn form-btn"
                    onClick={handlePayment}
                    style={{ flex: 1, backgroundColor: "#28a745" }} // Green color for payment
                  >
                    Pay & Book ($50)
                  </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookAppointment;
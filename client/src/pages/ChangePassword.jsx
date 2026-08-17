import React, { useEffect, useState } from "react";
import "../styles/profile.css";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import axios from "axios";
import toast from "react-hot-toast";
import { setLoading } from "../redux/reducers/rootSlice";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../components/Loading";
import fetchData from "../helper/apiCall";
import jwt_decode from "jwt-decode";
import { FaLock, FaKey } from "react-icons/fa";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

function ChangePassword() {
  const token = localStorage.getItem("token") || "";
  let userId = null;
  try {
    userId = token ? jwt_decode(token).userId : null;
  } catch (e) {
    userId = null;
  }

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.root);
  const [file, setFile] = useState("");
  const [formDetails, setFormDetails] = useState({
    password: "",
    newpassword: "",
    confnewpassword: "",
  });

  const getUser = async () => {
    if (!userId) return;
    try {
      dispatch(setLoading(true));
      const temp = await fetchData(`/user/getuser/${userId}`);
      if (temp) {
        setFile(temp.pic || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg");
      }
      dispatch(setLoading(false));
    } catch (error) {
      console.error("Error fetching user data:", error);
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    getUser();
  }, [dispatch]);

  const inputChange = (e) => {
    const { name, value } = e.target;
    setFormDetails({
      ...formDetails,
      [name]: value,
    });
  };

  const formSubmit = async (e) => {
    e.preventDefault();
    const { password, newpassword, confnewpassword } = formDetails;

    if (!password || !newpassword || !confnewpassword) {
      return toast.error("Please fill in all password fields");
    }
    if (newpassword !== confnewpassword) {
      return toast.error("New passwords do not match");
    }
    if (newpassword.length < 5) {
      return toast.error("New password must be at least 5 characters long");
    }

    try {
      const response = await axios.put(
        "/user/changepassword",
        {
          userId: userId,
          currentPassword: password,
          newPassword: newpassword,
          confirmNewPassword: confnewpassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data === "Password changed successfully") {
        toast.success("Password updated successfully!");
        setFormDetails({
          password: "",
          newpassword: "",
          confnewpassword: "",
        });
      } else {
        toast.error("Unable to update password");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      if (error.response && error.response.data) {
        toast.error(error.response.data);
      } else {
        toast.error("Failed to change password");
      }
    }
  };

  return (
    <>
      <Navbar />
      {loading ? (
        <Loading />
      ) : (
        <section className="profile-section">
          <div className="profile-card">
            <div className="profile-avatar-wrapper">
              <img src={file} alt="profile" className="profile-pic" />
              <h2 className="form-heading">Change Password</h2>
            </div>

            <form onSubmit={formSubmit} className="profile-form">
              <div className="form-group-field">
                <label>Current Password *</label>
                <input
                  type="password"
                  name="password"
                  className="form-input"
                  placeholder="Enter your current password"
                  value={formDetails.password}
                  onChange={inputChange}
                  required
                />
              </div>

              <div className="form-same-row">
                <div className="form-group-field">
                  <label>New Password *</label>
                  <input
                    type="password"
                    name="newpassword"
                    className="form-input"
                    placeholder="Enter new password"
                    value={formDetails.newpassword}
                    onChange={inputChange}
                    required
                  />
                </div>
                <div className="form-group-field">
                  <label>Confirm New Password *</label>
                  <input
                    type="password"
                    name="confnewpassword"
                    className="form-input"
                    placeholder="Confirm new password"
                    value={formDetails.confnewpassword}
                    onChange={inputChange}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn profile-btn">
                <FaKey /> Update Password
              </button>
            </form>
          </div>
        </section>
      )}
      <Footer />
    </>
  );
}

export default ChangePassword;

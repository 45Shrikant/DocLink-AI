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
import { FaUserEdit, FaSave } from "react-icons/fa";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

function Profile() {
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
    firstname: "",
    lastname: "",
    email: "",
    age: "",
    mobile: "",
    gender: "neither",
    address: "",
    password: "",
    confpassword: "",
  });

  const getUser = async () => {
    if (!userId) return;
    try {
      dispatch(setLoading(true));
      const temp = await fetchData(`/user/getuser/${userId}`);
      if (temp) {
        setFormDetails({
          ...temp,
          password: "",
          confpassword: "",
          mobile: temp.mobile === null ? "" : temp.mobile,
          age: temp.age === null ? "" : temp.age,
        });
        setFile(temp.pic || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg");
      }
      dispatch(setLoading(false));
    } catch (error) {
      console.error("Error fetching user profile:", error);
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
    try {
      e.preventDefault();
      const {
        firstname,
        lastname,
        email,
        age,
        mobile,
        address,
        gender,
        password,
        confpassword,
      } = formDetails;

      if (!email) {
        return toast.error("Email should not be empty");
      } else if (firstname.length < 3) {
        return toast.error("First name must be at least 3 characters long");
      } else if (lastname.length < 3) {
        return toast.error("Last name must be at least 3 characters long");
      } else if (password && password.length < 5) {
        return toast.error("Password must be at least 5 characters long");
      } else if (password && password !== confpassword) {
        return toast.error("Passwords do not match");
      }

      await toast.promise(
        axios.put(
          "/user/updateprofile",
          {
            firstname,
            lastname,
            age,
            mobile,
            address,
            gender,
            email,
            password: password || undefined,
          },
          {
            headers: {
              authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        ),
        {
          pending: "Updating profile...",
          success: "Profile updated successfully!",
          error: "Unable to update profile",
          loading: "Updating profile...",
        }
      );

      setFormDetails({ ...formDetails, password: "", confpassword: "" });
    } catch (error) {
      return toast.error("Unable to update profile");
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
              <h2 className="form-heading">My Profile</h2>
            </div>

            <form onSubmit={formSubmit} className="profile-form">
              <div className="form-same-row">
                <div className="form-group-field">
                  <label>First Name *</label>
                  <input
                    type="text"
                    name="firstname"
                    className="form-input"
                    placeholder="First Name"
                    value={formDetails.firstname}
                    onChange={inputChange}
                    required
                  />
                </div>
                <div className="form-group-field">
                  <label>Last Name *</label>
                  <input
                    type="text"
                    name="lastname"
                    className="form-input"
                    placeholder="Last Name"
                    value={formDetails.lastname}
                    onChange={inputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-same-row">
                <div className="form-group-field">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    className="form-input"
                    placeholder="Email"
                    value={formDetails.email}
                    onChange={inputChange}
                    required
                  />
                </div>
                <div className="form-group-field">
                  <label>Gender</label>
                  <select
                    name="gender"
                    value={formDetails.gender}
                    className="form-input"
                    id="gender"
                    onChange={inputChange}
                  >
                    <option value="neither">Prefer not to say</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-same-row">
                <div className="form-group-field">
                  <label>Age</label>
                  <input
                    type="number"
                    name="age"
                    className="form-input"
                    placeholder="Age"
                    value={formDetails.age}
                    onChange={inputChange}
                  />
                </div>
                <div className="form-group-field">
                  <label>Mobile Number</label>
                  <input
                    type="tel"
                    name="mobile"
                    className="form-input"
                    placeholder="Mobile Number"
                    value={formDetails?.mobile}
                    onChange={inputChange}
                  />
                </div>
              </div>

              <div className="form-group-field">
                <label>Address</label>
                <textarea
                  name="address"
                  className="form-input"
                  placeholder="Your residential address"
                  value={formDetails.address}
                  onChange={inputChange}
                  rows="2"
                ></textarea>
              </div>

              <button type="submit" className="btn profile-btn">
                <FaSave /> Save Changes
              </button>
            </form>
          </div>
        </section>
      )}
      <Footer />
    </>
  );
}

export default Profile;

import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/register.css";
import Navbar from "../components/Navbar";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

function Register() {
  const [file, setFile] = useState("");
  const [selectedRole, setSelectedRole] = useState("Patient");
  const [loading, setLoading] = useState(false);
  const [formDetails, setFormDetails] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confpassword: "",
  });
  const navigate = useNavigate();

  const inputChange = (e) => {
    const { name, value } = e.target;
    setFormDetails({
      ...formDetails,
      [name]: value,
    });
  };

  const onUpload = async (element) => {
    if (!element) return;
    setLoading(true);
    if (
      element.type === "image/jpeg" ||
      element.type === "image/png" ||
      element.type === "image/jpg"
    ) {
      const data = new FormData();
      data.append("file", element);
      data.append("upload_preset", process.env.REACT_APP_CLOUDINARY_PRESET || "doctorApp");
      data.append("cloud_name", process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || "davfqvfzx");
      try {
        const res = await fetch(
          process.env.REACT_APP_CLOUDINARY_BASE_URL ||
            "https://api.cloudinary.com/v1_1/davfqvfzx/image/upload",
          {
            method: "POST",
            body: data,
          }
        );
        const imgData = await res.json();
        if (imgData.url) {
          setFile(imgData.url.toString());
          toast.success("Profile photo uploaded!");
        }
      } catch (err) {
        toast.error("Image upload failed");
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      toast.error("Please select a JPEG or PNG image");
    }
  };

  const formSubmit = async (e) => {
    try {
      e.preventDefault();

      if (loading) return;
      const { firstname, lastname, email, password, confpassword } = formDetails;
      if (!firstname || !lastname || !email || !password || !confpassword || !selectedRole) {
        return toast.error("Please fill in all required fields");
      } else if (firstname.length < 3) {
        return toast.error("First name must be at least 3 characters");
      } else if (lastname.length < 3) {
        return toast.error("Last name must be at least 3 characters");
      } else if (password.length < 5) {
        return toast.error("Password must be at least 5 characters");
      } else if (password !== confpassword) {
        return toast.error("Passwords do not match");
      }

      await toast.promise(
        axios.post("/user/register", {
          firstname,
          lastname,
          email,
          password,
          pic: file || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
          role: selectedRole,
        }),
        {
          pending: "Creating account...",
          success: "Registration successful! Please login.",
          error: "Registration failed. Email might already exist.",
          loading: "Creating account...",
        }
      );
      return navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Navbar />
      <section className="register-section">
        <div className="register-container wide">
          <h2 className="form-heading">Create an Account</h2>
          <p className="form-subheading">Join DocLink-AI to book appointments or manage practice</p>

          <form onSubmit={formSubmit} className="register-form">
            <div className="role-toggle-group">
              <label>Select Your Role</label>
              <div className="role-pills">
                {["Patient", "Doctor", "Admin"].map((r) => (
                  <button
                    key={r}
                    type="button"
                    className={`role-pill-btn ${selectedRole === r ? "active" : ""}`}
                    onClick={() => setSelectedRole(r)}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-row-2">
              <input
                type="text"
                name="firstname"
                className="form-input"
                placeholder="First Name *"
                value={formDetails.firstname}
                onChange={inputChange}
                required
              />
              <input
                type="text"
                name="lastname"
                className="form-input"
                placeholder="Last Name *"
                value={formDetails.lastname}
                onChange={inputChange}
                required
              />
            </div>

            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="Email Address *"
              value={formDetails.email}
              onChange={inputChange}
              required
            />

            <div className="file-upload-wrapper">
              <label>Profile Picture (Optional)</label>
              <input
                type="file"
                onChange={(e) => onUpload(e.target.files[0])}
                name="profile-pic"
                id="profile-pic"
                className="form-input"
                accept="image/*"
              />
            </div>

            <div className="form-row-2">
              <input
                type="password"
                name="password"
                className="form-input"
                placeholder="Password *"
                value={formDetails.password}
                onChange={inputChange}
                required
              />
              <input
                type="password"
                name="confpassword"
                className="form-input"
                placeholder="Confirm Password *"
                value={formDetails.confpassword}
                onChange={inputChange}
                required
              />
            </div>

            <button
              type="submit"
              className="btn form-btn"
              disabled={loading}
            >
              {loading ? "Uploading Image..." : "Create Account"}
            </button>
          </form>

          <div className="auth-links">
            <p>
              Already have an account?{" "}
              <NavLink className="login-link" to={"/login"}>
                Log in
              </NavLink>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default Register;

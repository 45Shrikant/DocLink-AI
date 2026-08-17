import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/navbar.css";
import { HashLink } from "react-router-hash-link";
import { useDispatch, useSelector } from "react-redux";
import { setUserInfo } from "../redux/reducers/rootSlice";
import { FiMenu } from "react-icons/fi";
import { RxCross1 } from "react-icons/rx";
import { FaHeartbeat, FaUserCircle } from "react-icons/fa";
import jwt_decode from "jwt-decode";
import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

const Navbar = () => {
  const [iconActive, setIconActive] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem("token") || "";
  let user = null;
  try {
    user = token ? jwt_decode(token) : null;
  } catch (e) {
    user = null;
  }

  const { userInfo } = useSelector((state) => state.root);

  const logoutFunc = () => {
    dispatch(setUserInfo({}));
    localStorage.removeItem("token");
    navigate("/login");
  };

  const closeMenu = () => {
    setIconActive(false);
  };

  return (
    <header>
      <nav className={iconActive ? "nav-active" : ""}>
        <h2 className="nav-logo">
          <NavLink to={"/"} onClick={closeMenu}>
            <span className="nav-logo-icon">
              <FaHeartbeat />
            </span>
            <span>DocLink</span>
            <span className="ai-badge">AI</span>
          </NavLink>
        </h2>

        <ul className="nav-links">
          <li>
            <NavLink to={"/"} onClick={closeMenu}>
              Home
            </NavLink>
          </li>

          {user && (user.role === "Admin" || user.isAdmin) && (
            <li>
              <NavLink to={"/dashboard/home"} onClick={closeMenu}>
                Dashboard
              </NavLink>
            </li>
          )}

          {user && user.role === "Doctor" && (
            <>
              <li>
                <NavLink to={"/applyfordoctor"} onClick={closeMenu}>
                  Doctor Profile
                </NavLink>
              </li>
              <li>
                <NavLink to={"/appointments"} onClick={closeMenu}>
                  Appointments
                </NavLink>
              </li>
              <li>
                <NavLink to={"/notifications"} onClick={closeMenu}>
                  Notifications
                </NavLink>
              </li>
              <li>
                <HashLink to={"/#contact"} onClick={closeMenu}>
                  Contact Us
                </HashLink>
              </li>
              <li>
                <NavLink to={"/profile"} onClick={closeMenu}>
                  Profile
                </NavLink>
              </li>
            </>
          )}

          {user && user.role === "Patient" && (
            <>
              <li>
                <NavLink to={"/doctors"} onClick={closeMenu}>
                  Doctors
                </NavLink>
              </li>
              <li>
                <NavLink to={"/appointments"} onClick={closeMenu}>
                  My Appointments
                </NavLink>
              </li>
              <li>
                <NavLink to={"/notifications"} onClick={closeMenu}>
                  Notifications
                </NavLink>
              </li>
              <li>
                <HashLink to={"/#contact"} onClick={closeMenu}>
                  Contact Us
                </HashLink>
              </li>
              <li>
                <NavLink to={"/profile"} onClick={closeMenu}>
                  Profile
                </NavLink>
              </li>
            </>
          )}

          {!token ? (
            <>
              <li>
                <NavLink className="btn btn-login" to={"/login"} onClick={closeMenu}>
                  Log in
                </NavLink>
              </li>
              <li>
                <NavLink className="btn" to={"/register"} onClick={closeMenu}>
                  Sign up
                </NavLink>
              </li>
            </>
          ) : (
            <li>
              <button className="btn btn-logout" onClick={logoutFunc}>
                Logout
              </button>
            </li>
          )}
        </ul>

        <div className="menu-icons" onClick={() => setIconActive(!iconActive)}>
          {iconActive ? <RxCross1 /> : <FiMenu />}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

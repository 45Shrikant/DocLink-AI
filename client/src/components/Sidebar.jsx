import React from "react";
import {
  FaHome,
  FaList,
  FaUser,
  FaUserMd,
  FaUsers,
  FaEnvelope,
  FaHeartbeat,
} from "react-icons/fa";
import "../styles/sidebar.css";
import { NavLink, useNavigate } from "react-router-dom";
import { MdLogout } from "react-icons/md";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../redux/reducers/rootSlice";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const sidebarLinks = [
    {
      name: "Dashboard",
      path: "/dashboard/home",
      icon: <FaHome />,
    },
    {
      name: "Users",
      path: "/dashboard/users",
      icon: <FaUsers />,
    },
    {
      name: "Doctors",
      path: "/dashboard/doctors",
      icon: <FaUserMd />,
    },
    {
      name: "Appointments",
      path: "/dashboard/appointments",
      icon: <FaList />,
    },
    {
      name: "Applications",
      path: "/dashboard/applications",
      icon: <FaEnvelope />,
    },
    {
      name: "My Profile",
      path: "/dashboard/aprofile",
      icon: <FaUser />,
    },
  ];

  const logoutFunc = () => {
    dispatch(setUserInfo({}));
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <aside className="sidebar-section">
      <div>
        <div className="sidebar-brand">
          <FaHeartbeat />
          <span>DocLink Admin</span>
        </div>

        <nav className="sidebar-nav">
          {sidebarLinks.map((ele, i) => (
            <NavLink
              to={ele.path}
              key={i}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              {ele.icon}
              <span>{ele.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="sidebar-footer">
        <button className="sidebar-logout-btn" onClick={logoutFunc}>
          <MdLogout />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

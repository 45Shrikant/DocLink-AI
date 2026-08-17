import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { FaUsers, FaList, FaUserMd } from "react-icons/fa";
import Loading from "./Loading";
import { setLoading } from "../redux/reducers/rootSlice";
import { useDispatch, useSelector } from "react-redux";
import fetchData from "../helper/apiCall";
import axios from "axios";
import "../styles/Home.css";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

const Home = () => {
  const [userCount, setUserCount] = useState(0);
  const [appointmentCount, setAppointmentCount] = useState(0);
  const [doctorCount, setDoctorCount] = useState(0);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.root);

  const fetchDataCounts = async () => {
    try {
      dispatch(setLoading(true));
      const userData = await fetchData("/user/getallusers");
      const appointmentData = await fetchData("/appointment/getallappointments");
      const doctorData = await fetchData("/doctor/getalldoctors");
      setUserCount(Array.isArray(userData) ? userData.length : 0);
      setAppointmentCount(Array.isArray(appointmentData) ? appointmentData.length : 0);
      setDoctorCount(Array.isArray(doctorData) ? doctorData.length : 0);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchDataCounts();
  }, []);

  const chartData = [
    { name: "Users", count: userCount },
    { name: "Appointments", count: appointmentCount },
    { name: "Doctors", count: doctorCount },
  ];

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <main className="dashboard-main-area">
          <div className="dashboard-header">
            <h1>Platform Analytics</h1>
            <p>Real-time overview of users, appointments, and medical personnel.</p>
          </div>

          <div className="dashboard-metrics-grid">
            <div className="metric-card users">
              <div className="metric-info">
                <h3>Registered Users</h3>
                <h2>{userCount}</h2>
              </div>
              <div className="metric-icon-box">
                <FaUsers />
              </div>
            </div>

            <div className="metric-card appointments">
              <div className="metric-info">
                <h3>Total Bookings</h3>
                <h2>{appointmentCount}</h2>
              </div>
              <div className="metric-icon-box">
                <FaList />
              </div>
            </div>

            <div className="metric-card doctors">
              <div className="metric-info">
                <h3>Active Doctors</h3>
                <h2>{doctorCount}</h2>
              </div>
              <div className="metric-icon-box">
                <FaUserMd />
              </div>
            </div>
          </div>

          <div className="dashboard-charts-grid">
            <div className="chart-card">
              <h3>System Distribution</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={{
                      background: "#ffffff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    }}
                  />
                  <Bar dataKey="count" fill="#0284c7" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card">
              <h3>Growth Trends</h3>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={{
                      background: "#ffffff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ r: 5, fill: "#10b981" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </main>
      )}
    </>
  );
};

export default Home;

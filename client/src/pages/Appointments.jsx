import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Empty from "../components/Empty";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import fetchData from "../helper/apiCall";
import { setLoading } from "../redux/reducers/rootSlice";
import Loading from "../components/Loading";
import { toast } from "react-hot-toast";
import jwt_decode from "jwt-decode";
import axios from "axios";
import "../styles/user.css";
import { FaCalendarCheck, FaCheckCircle, FaUserMd } from "react-icons/fa";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const PerPage = 6;
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.root);
  const token = localStorage.getItem("token") || "";
  let userId = null;
  try {
    userId = token ? jwt_decode(token).userId : null;
  } catch (e) {
    userId = null;
  }

  const getAllAppoint = async () => {
    if (!userId) return;
    try {
      dispatch(setLoading(true));
      const temp = await fetchData(
        `/appointment/getallappointments?search=${userId}`
      );
      setAppointments(temp || []);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error("Failed to fetch appointments");
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    getAllAppoint();
  }, []);

  const totalPages = Math.ceil(appointments.length / PerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const paginatedAppointments = appointments.slice(
    (currentPage - 1) * PerPage,
    currentPage * PerPage
  );

  const completeAppointment = async (appointment) => {
    try {
      await axios.put(
        "/appointment/completed",
        {
          appointid: appointment._id,
          doctorId: appointment.doctorId?._id,
          doctorname: `${appointment.userId?.firstname} ${appointment.userId?.lastname}`,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Appointment marked as completed!");
      getAllAppoint();
    } catch (error) {
      console.error("Error completing appointment:", error);
      toast.error("Failed to complete appointment");
    }
  };

  return (
    <>
      <Navbar />
      {loading ? (
        <Loading />
      ) : (
        <section className="container user-section" style={{ minHeight: "85vh" }}>
          <div className="table-page-header" style={{ width: "100%" }}>
            <div>
              <h2 className="page-heading" style={{ margin: "0 0 0.5rem 0" }}>
                Scheduled Appointments
              </h2>
              <p style={{ color: "var(--text-muted)", textAlign: "center" }}>
                Manage your consultations, view medical slots, and track completion.
              </p>
            </div>
          </div>

          {appointments.length > 0 ? (
            <div className="user-table-card" style={{ width: "100%" }}>
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Doctor</th>
                      <th>Patient</th>
                      <th>Age / Gender</th>
                      <th>Contact</th>
                      <th>Blood Group</th>
                      <th>Appointment Time</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedAppointments.map((appointment, index) => (
                      <tr key={appointment._id}>
                        <td>{(currentPage - 1) * PerPage + index + 1}</td>
                        <td style={{ fontWeight: 600 }}>
                          <FaUserMd style={{ color: "var(--primary)", marginRight: "4px" }} />
                          Dr. {appointment.doctorId?.firstname} {appointment.doctorId?.lastname}
                        </td>
                        <td>
                          {appointment.userId?.firstname} {appointment.userId?.lastname}
                        </td>
                        <td>
                          {appointment.age ? `${appointment.age} yrs` : "—"} / {appointment.gender || "—"}
                        </td>
                        <td>{appointment.number}</td>
                        <td>{appointment.bloodGroup || "—"}</td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{appointment.date}</div>
                          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                            {appointment.time}
                          </div>
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              appointment.status === "Completed"
                                ? "badge-success"
                                : "badge-warning"
                            }`}
                          >
                            {appointment.status || "Pending"}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-complete"
                            onClick={() => completeAppointment(appointment)}
                            disabled={appointment.status === "Completed"}
                          >
                            <FaCheckCircle /> Complete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="pagination">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      className={currentPage === i + 1 ? "active" : ""}
                      onClick={() => handlePageChange(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <Empty message="You have no scheduled appointments." />
          )}
        </section>
      )}
      <Footer />
    </>
  );
};

export default Appointments;

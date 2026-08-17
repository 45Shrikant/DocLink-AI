import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Loading from "./Loading";
import { setLoading } from "../redux/reducers/rootSlice";
import { useDispatch, useSelector } from "react-redux";
import Empty from "./Empty";
import fetchData from "../helper/apiCall";
import "../styles/user.css";
import { FaCheckCircle, FaCalendarAlt } from "react-icons/fa";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.root);

  const getAllAppoint = async () => {
    try {
      dispatch(setLoading(true));
      const temp = await fetchData(`/appointment/getallappointments`);
      setAppointments(temp || []);
      dispatch(setLoading(false));
    } catch (error) {
      console.error(error);
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    getAllAppoint();
  }, []);

  const complete = async (ele) => {
    try {
      await toast.promise(
        axios.put(
          "/appointment/completed",
          {
            appointid: ele?._id,
            doctorId: ele?.doctorId?._id,
            doctorname: `${ele?.userId?.firstname} ${ele?.userId?.lastname}`,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        ),
        {
          success: "Appointment marked as completed",
          error: "Unable to update status",
          loading: "Updating status...",
        }
      );

      getAllAppoint();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <section className="user-section">
          <div className="table-page-header">
            <div>
              <h2>All Appointments</h2>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                Total: {appointments.length} appointment records
              </p>
            </div>
          </div>

          {appointments.length > 0 ? (
            <div className="user-table-card">
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Doctor</th>
                      <th>Patient</th>
                      <th>Patient Contact</th>
                      <th>Age / Gender</th>
                      <th>Blood Group</th>
                      <th>Scheduled Date & Time</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((ele, i) => (
                      <tr key={ele?._id}>
                        <td>{i + 1}</td>
                        <td style={{ fontWeight: 600 }}>
                          Dr. {ele?.doctorId?.firstname} {ele?.doctorId?.lastname}
                        </td>
                        <td>
                          {ele?.userId?.firstname} {ele?.userId?.lastname}
                        </td>
                        <td>{ele?.number || "—"}</td>
                        <td>
                          {ele?.age ? `${ele.age} yrs` : "—"} / {ele?.gender || "—"}
                        </td>
                        <td>{ele?.bloodGroup || "—"}</td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{ele?.date}</div>
                          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                            {ele?.time}
                          </div>
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              ele?.status === "Completed"
                                ? "badge-success"
                                : "badge-warning"
                            }`}
                          >
                            {ele?.status || "Pending"}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-complete"
                            disabled={ele?.status === "Completed"}
                            onClick={() => complete(ele)}
                          >
                            <FaCheckCircle /> Complete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <Empty message="No appointment records found." />
          )}
        </section>
      )}
    </>
  );
};

export default AdminAppointments;

import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Loading from "./Loading";
import { setLoading } from "../redux/reducers/rootSlice";
import { useDispatch, useSelector } from "react-redux";
import Empty from "./Empty";
import fetchData from "../helper/apiCall";
import "../styles/user.css";
import { FaCheck, FaTimes, FaUserClock } from "react-icons/fa";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.root);

  const getAllApp = async () => {
    try {
      dispatch(setLoading(true));
      const temp = await fetchData(`/doctor/getnotdoctors`);
      setApplications(temp || []);
      dispatch(setLoading(false));
    } catch (error) {
      console.error(error);
      dispatch(setLoading(false));
    }
  };

  const acceptUser = async (userId) => {
    try {
      const confirm = window.confirm("Approve this doctor application?");
      if (confirm) {
        await toast.promise(
          axios.put(
            "/doctor/acceptdoctor",
            { id: userId },
            {
              headers: {
                authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          ),
          {
            success: "Doctor application approved!",
            error: "Unable to approve application",
            loading: "Approving doctor...",
          }
        );
        getAllApp();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteUser = async (userId) => {
    try {
      const confirm = window.confirm("Reject this doctor application?");
      if (confirm) {
        await toast.promise(
          axios.put(
            "/doctor/rejectdoctor",
            { id: userId },
            {
              headers: {
                authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          ),
          {
            success: "Doctor application rejected",
            error: "Unable to reject application",
            loading: "Rejecting application...",
          }
        );
        getAllApp();
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllApp();
  }, []);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <section className="user-section">
          <div className="table-page-header">
            <div>
              <h2>Doctor Verification Requests</h2>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                Pending Review: {applications.length} applications
              </p>
            </div>
          </div>

          {applications.length > 0 ? (
            <div className="user-table-card">
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Applicant</th>
                      <th>Email</th>
                      <th>Mobile</th>
                      <th>Specialization</th>
                      <th>Experience</th>
                      <th>Fee</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((ele, i) => (
                      <tr key={ele?._id}>
                        <td>{i + 1}</td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                            <img
                              className="user-table-pic"
                              src={
                                ele?.userId?.pic ||
                                "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
                              }
                              alt={ele?.userId?.firstname}
                            />
                            <div style={{ fontWeight: 600 }}>
                              {ele?.userId?.firstname} {ele?.userId?.lastname}
                            </div>
                          </div>
                        </td>
                        <td>{ele?.userId?.email}</td>
                        <td>{ele?.userId?.mobile || "—"}</td>
                        <td>
                          <span className="badge badge-warning">
                            {ele?.specialization || "Physician"}
                          </span>
                        </td>
                        <td>{ele?.experience ? `${ele.experience} yrs` : "—"}</td>
                        <td style={{ fontWeight: 700, color: "var(--primary)" }}>
                          ${ele?.fees || 50}
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn btn-sm btn-accept"
                              onClick={() => acceptUser(ele?.userId?._id)}
                            >
                              <FaCheck /> Accept
                            </button>
                            <button
                              className="btn btn-sm btn-reject"
                              onClick={() => deleteUser(ele?.userId?._id)}
                            >
                              <FaTimes /> Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <Empty message="No pending doctor applications." />
          )}
        </section>
      )}
    </>
  );
};

export default AdminApplications;

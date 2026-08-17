import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Loading from "./Loading";
import { setLoading } from "../redux/reducers/rootSlice";
import { useDispatch, useSelector } from "react-redux";
import Empty from "./Empty";
import fetchData from "../helper/apiCall";
import "../styles/user.css";
import { FaTrashAlt, FaSearch, FaUserMd } from "react-icons/fa";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.root);

  const getAllDoctors = async () => {
    try {
      dispatch(setLoading(true));
      const temp = await fetchData("/doctor/getalldoctors");
      setDoctors(temp || []);
      dispatch(setLoading(false));
    } catch (error) {
      console.error(error);
      dispatch(setLoading(false));
    }
  };

  const deleteUser = async (userId) => {
    try {
      const confirm = window.confirm("Are you sure you want to revoke doctor status?");
      if (confirm) {
        await toast.promise(
          axios.put(
            "/doctor/deletedoctor",
            { userId },
            {
              headers: {
                authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          ),
          {
            success: "Doctor access revoked",
            error: "Unable to revoke doctor status",
            loading: "Updating status...",
          }
        );
        getAllDoctors();
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllDoctors();
  }, []);

  const filteredDoctors = doctors.filter((doc) => {
    const fullName = `${doc?.userId?.firstname || ""} ${doc?.userId?.lastname || ""}`.toLowerCase();
    const specialty = (doc?.specialization || "").toLowerCase();
    const query = searchTerm.toLowerCase();
    return fullName.includes(query) || specialty.includes(query);
  });

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <section className="user-section">
          <div className="table-page-header">
            <div>
              <h2>Verified Doctors Directory</h2>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                Total: {doctors.length} active practitioners
              </p>
            </div>

            <div className="table-controls">
              <div className="control-item">
                <FaSearch style={{ color: "var(--text-muted)" }} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search doctor or specialty..."
                />
              </div>
            </div>
          </div>

          {filteredDoctors.length > 0 ? (
            <div className="user-table-card">
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Doctor</th>
                      <th>Email</th>
                      <th>Mobile</th>
                      <th>Specialization</th>
                      <th>Experience</th>
                      <th>Fee</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDoctors.map((ele, i) => (
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
                              Dr. {ele?.userId?.firstname} {ele?.userId?.lastname}
                            </div>
                          </div>
                        </td>
                        <td>{ele?.userId?.email}</td>
                        <td>{ele?.userId?.mobile || "—"}</td>
                        <td>
                          <span className="badge badge-primary">
                            {ele?.specialization || "General Physician"}
                          </span>
                        </td>
                        <td>{ele?.experience ? `${ele.experience} yrs` : "—"}</td>
                        <td style={{ fontWeight: 700, color: "var(--primary)" }}>
                          ${ele?.fees || 50}
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-remove"
                            onClick={() => deleteUser(ele?.userId?._id)}
                          >
                            <FaTrashAlt /> Revoke
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <Empty message="No active doctors found." />
          )}
        </section>
      )}
    </>
  );
};

export default AdminDoctors;

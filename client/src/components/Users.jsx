import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Loading from "./Loading";
import { setLoading } from "../redux/reducers/rootSlice";
import { useDispatch, useSelector } from "react-redux";
import Empty from "./Empty";
import fetchData from "../helper/apiCall";
import "../styles/user.css";
import { FaTrashAlt, FaSearch, FaFilter } from "react-icons/fa";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

const Users = () => {
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const { loading } = useSelector((state) => state.root);

  const getAllUsers = async () => {
    try {
      dispatch(setLoading(true));
      const temp = await fetchData("/user/getallusers");
      setUsers(temp || []);
      dispatch(setLoading(false));
    } catch (error) {
      console.error(error);
      dispatch(setLoading(false));
    }
  };

  const deleteUser = async (userId) => {
    try {
      const confirm = window.confirm("Are you sure you want to remove this user?");
      if (confirm) {
        await toast.promise(
          axios.delete("/user/deleteuser", {
            headers: {
              authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            data: { userId },
          }),
          {
            pending: "Deleting user...",
            success: "User removed successfully",
            error: "Unable to delete user",
            loading: "Deleting user...",
          }
        );
        getAllUsers();
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const filteredUsers = users.filter((u) => {
    const fullName = `${u.firstname || ""} ${u.lastname || ""}`.toLowerCase();
    const email = (u.email || "").toLowerCase();
    const query = searchTerm.toLowerCase();
    const matchesSearch = fullName.includes(query) || email.includes(query);

    if (filter === "doctors") {
      return matchesSearch && u.isDoctor;
    } else if (filter === "patients") {
      return matchesSearch && !u.isDoctor && !u.isAdmin;
    }
    return matchesSearch;
  });

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <section className="user-section">
          <div className="table-page-header">
            <div>
              <h2>User Management</h2>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                Total: {users.length} registered accounts
              </p>
            </div>

            <div className="table-controls">
              <div className="control-item">
                <FaFilter style={{ color: "var(--text-muted)" }} />
                <label htmlFor="filter">Role:</label>
                <select
                  id="filter"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">All Users</option>
                  <option value="patients">Patients</option>
                  <option value="doctors">Doctors</option>
                </select>
              </div>

              <div className="control-item">
                <FaSearch style={{ color: "var(--text-muted)" }} />
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search name or email..."
                />
              </div>
            </div>
          </div>

          {filteredUsers.length > 0 ? (
            <div className="user-table-card">
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>User</th>
                      <th>Email</th>
                      <th>Mobile</th>
                      <th>Age / Gender</th>
                      <th>Role</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((ele, i) => (
                      <tr key={ele._id}>
                        <td>{i + 1}</td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                            <img
                              className="user-table-pic"
                              src={
                                ele.pic ||
                                "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
                              }
                              alt={ele.firstname}
                            />
                            <div>
                              <div style={{ fontWeight: 600 }}>
                                {ele.firstname} {ele.lastname}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>{ele.email}</td>
                        <td>{ele.mobile || "—"}</td>
                        <td>
                          {ele.age ? `${ele.age} yrs` : "—"} / {ele.gender || "—"}
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              ele.isAdmin
                                ? "badge-warning"
                                : ele.isDoctor
                                ? "badge-primary"
                                : "badge-success"
                            }`}
                          >
                            {ele.isAdmin ? "Admin" : ele.isDoctor ? "Doctor" : "Patient"}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-remove"
                            onClick={() => deleteUser(ele._id)}
                          >
                            <FaTrashAlt /> Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <Empty message="No matching users found." />
          )}
        </section>
      )}
    </>
  );
};

export default Users;

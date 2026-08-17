import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../styles/notification.css";
import Empty from "../components/Empty";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import fetchData from "../helper/apiCall";
import { setLoading } from "../redux/reducers/rootSlice";
import Loading from "../components/Loading";
import { FaBell, FaCalendarCheck, FaInfoCircle } from "react-icons/fa";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const notificationsPerPage = 8;
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.root);

  const getAllNotif = async () => {
    try {
      dispatch(setLoading(true));
      const temp = await fetchData(
        `/notification/getallnotifs?page=${currentPage - 1}&limit=${notificationsPerPage}`
      );
      setNotifications(temp || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    getAllNotif();
  }, [currentPage]);

  const totalPages = Math.ceil(notifications.length / notificationsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const paginatedNotifications = notifications.slice(
    (currentPage - 1) * notificationsPerPage,
    currentPage * notificationsPerPage
  );

  return (
    <>
      <Navbar />
      {loading ? (
        <Loading />
      ) : (
        <section className="notif-page-section">
          <div className="notif-container">
            <h2 className="page-heading">Your Notifications</h2>

            {notifications.length > 0 ? (
              <>
                <div className="notif-list">
                  {paginatedNotifications.map((ele) => {
                    const isAppointment = ele?.content?.toLowerCase().includes("appointment");
                    const dateStr = ele?.updatedAt ? ele.updatedAt.split("T")[0] : "";
                    const timeStr = ele?.updatedAt && ele.updatedAt.includes("T") ? ele.updatedAt.split("T")[1].split(".")[0] : "";

                    return (
                      <div className="notif-card" key={ele?._id}>
                        <div className="notif-icon">
                          {isAppointment ? <FaCalendarCheck /> : <FaBell />}
                        </div>
                        <div className="notif-content-area">
                          <p className="notif-text">{ele?.content}</p>
                          <span className="notif-time">
                            {dateStr} • {timeStr}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {totalPages > 1 && (
                  <div className="pagination" style={{ marginTop: "2rem" }}>
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
              </>
            ) : (
              <Empty message="You have no notifications at this time." />
            )}
          </div>
        </section>
      )}
      <Footer />
    </>
  );
};

export default Notifications;

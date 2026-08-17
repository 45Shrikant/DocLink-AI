import React, { useEffect, useState } from "react";
import DoctorCard from "../components/DoctorCard";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import "../styles/doctors.css";
import fetchData from "../helper/apiCall";
import Loading from "../components/Loading";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../redux/reducers/rootSlice";
import Empty from "../components/Empty";
import { FaSearch, FaUserMd } from "react-icons/fa";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.root);

  const fetchAllDocs = async () => {
    dispatch(setLoading(true));
    try {
      const data = await fetchData(`/doctor/getalldoctors`);
      setDoctors(data || []);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchAllDocs();
  }, []);

  // Extract unique specialties for the filter dropdown
  const specialties = [
    "all",
    ...new Set(
      doctors
        .map((doc) => doc.specialization)
        .filter((spec) => spec && spec.trim() !== "")
    ),
  ];

  const filteredDoctors = doctors.filter((doc) => {
    const fullName = `${doc?.userId?.firstname || ""} ${doc?.userId?.lastname || ""}`.toLowerCase();
    const specialty = (doc?.specialization || "").toLowerCase();
    const query = searchTerm.toLowerCase();
    const matchesSearch = fullName.includes(query) || specialty.includes(query);
    const matchesSpecialty =
      selectedSpecialty === "all" ||
      specialty === selectedSpecialty.toLowerCase();
    return matchesSearch && matchesSpecialty;
  });

  return (
    <>
      <Navbar />
      <section className="doctors-page-section">
        <div className="doctors-header-area">
          <div className="badge badge-primary" style={{ margin: "0 auto 0.75rem" }}>
            <FaUserMd /> Certified Medical Directory
          </div>
          <h2 className="page-heading">Find & Consult Specialists</h2>
          <p>
            Choose from top-rated, admin-verified doctors across multiple fields. Book in-person or online video appointments.
          </p>
        </div>

        <div className="doctors-filter-bar">
          <div className="search-input-wrapper">
            <FaSearch />
            <input
              type="text"
              placeholder="Search by doctor name or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="specialty-select"
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
          >
            {specialties.map((spec, i) => (
              <option key={i} value={spec}>
                {spec === "all" ? "All Specialties" : spec}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <Loading />
        ) : filteredDoctors.length > 0 ? (
          <div className="doctors-card-container">
            {filteredDoctors.map((ele) => (
              <DoctorCard ele={ele} key={ele._id} />
            ))}
          </div>
        ) : (
          <Empty />
        )}
      </section>
      <Footer />
    </>
  );
};

export default Doctors;

import React, { useState, useEffect } from "react";
import "../App.css";
import { CiSearch } from "react-icons/ci";
import { MdLocationOn, MdWorkOutline } from "react-icons/md";
import Header from "./HeaderComponents/Header";
import Footer from "./HeaderComponents/Footer";
import "./HeaderComponents/Footer.css";
import { motion, AnimatePresence } from "framer-motion";


const normalizeScore = (score) => Math.round(score * 100);

const Discover = () => {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [location, setLocation] = useState("");
  const [internships, setInternships] = useState([]);

  

  // 🔹 Fetch data from backend
  useEffect(() => {
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token"); 

      const res = await fetch("http://127.0.0.1:8000/search/internships", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      const recs = data.recommendations || data;

      if (!Array.isArray(recs)) {
        console.error("❌ Backend did not return an array:", recs);
        setInternships([]);
        return;
      }

      const formatted = recs.map((rec, index) => ({
        id: index + 1,
        title: rec.title,
        company: rec.company_name,
        type: rec.workmode || "Not Specified",
        duration: rec.duration || "Not Specified",
        stipend: rec.stipend || "N/A",
        location: rec.location,
        domain: rec.domain,
        matchPercentage: normalizeScore(rec.final_score || 0),
        details: `Skills required: ${rec.skills || ""}`,
      }));

      setInternships(formatted);
    } catch (error) {
      console.error("❌ Error fetching internships:", error);
    }
  };

  fetchData();
}, []);

  // 🔹 Apply filters
  const filteredInternships = internships.filter((internship) => {
    const matchesSearch =
      internship.title.toLowerCase().includes(search.toLowerCase()) ||
      internship.company.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === "All" || internship.type === filterType;
    const matchesLocation =
      !location ||
      internship.location.toLowerCase().includes(location.toLowerCase());
    return matchesSearch && matchesType && matchesLocation;
  });

  return (
    <div><Header/>
      <div className="discover-container">
        {/* <Header /> */}
          
        {/* 🔍 Filters */}
        <div className="filters">
          {/* Search Bar */}
          <div className="input-icon">
            <CiSearch className="icon" />
            <input
              type="text"
              placeholder="Search by Title or Company"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Type Filter */}
          <div className="input-icon">
            <MdWorkOutline className="icon" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Remote">Remote</option>
              <option value="Onsite">Onsite</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          {/* Location Filter */}
          <div className="input-icon">
            <MdLocationOn className="icon" />
            <input
              type="text"
              placeholder="Filter by location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>

        {/* Internship Cards */}
        {/* <div className="internship-list">
          {filteredInternships.length > 0 ? (
            filteredInternships.map((internship) => (
              <div key={internship.id} className="internship-card">
                <div className="card-header">
                  <div>
                    <h3>{internship.title}</h3>
                    <p className="company-name">{internship.company}</p>
                    <div className="card-meta">
                      <MdLocationOn className="meta-icon" />
                      <span>{internship.location}</span>
                      <span className="domain-pill">{internship.domain}</span>
                      <div className="stipend">
                          ₹{internship.stipend}/month
                        </div>
                    </div>
                  </div>
                  <div className="match-score">
                    <strong>{internship.matchPercentage}%</strong>
                    <p className="match-label">Match Score</p>
                  </div>
                </div>

                <div className="skills-progress">
                  <span className="skills-label">Skills Match:</span>
                  <div className="progress-bar-wrapper">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${internship.matchPercentage}%` }}
                    ></div>
                  </div>
                </div>

                <div className="skill-tags">
                  {internship.details
                    .replace("Skills required:", "")
                    .split(",")
                    .map((skill, i) => (
                      <span key={i} className="tag">
                        {skill.trim()}
                      </span>
                    ))}
                </div>

                <button className="apply-btn">Apply Now</button>
              </div>
            ))
          ) : (
            <p className="no-results">No internships found 🚫</p>
          )}
        </div> */}

        <AnimatePresence>
  {filteredInternships.length > 0 ? (
    filteredInternships.map((internship, index) => (
      <motion.div
        key={internship.id}
        className="internship-card fullscreen-card"
        initial={{ x: 0, opacity: 1 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "100%", opacity: 0 }} // Swipe right on exit
        transition={{ duration: 0.6 }}
      >
        <div className="card-header">
          <div>
            <h3>{internship.title}</h3>
            <p className="company-name">{internship.company}</p>
            <div className="card-meta">
              <MdLocationOn className="meta-icon" />
              <span>{internship.location}</span>
              <span className="domain-pill">{internship.domain}</span>
              <div className="stipend">₹{internship.stipend}/month</div>
            </div>
          </div>
          <div className="match-score">
            <strong>{internship.matchPercentage}%</strong>
            <p className="match-label">Match Score</p>
          </div>
        </div>

        <div className="skills-progress">
          <span className="skills-label">Skills Match:</span>
          <div className="progress-bar-wrapper">
            <div
              className="progress-bar-fill"
              style={{ width: `${internship.matchPercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="skill-tags">
          {internship.details
            .replace("Skills required:", "")
            .split(",")
            .map((skill, i) => (
              <span key={i} className="tag">
                {skill.trim()}
              </span>
            ))}
        </div>

        {/* Apply button -> removes current card (swipe out) */}
        <button
          className="apply-btn"
          onClick={() => {
            setInternships((prev) =>
              prev.filter((_, i) => i !== index) // Remove current card
            );
          }}
        >
          Apply Now
        </button>
      </motion.div>
    ))
  ) : (
    <p className="no-results">No internships found 🚫</p>
  )}
</AnimatePresence>


        <div className="discoverFooter">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Discover;
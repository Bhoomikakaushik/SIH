import React, { useState, useEffect } from "react";
import "../App.css";
import Navbar from "./Navbar";
import { CiSearch } from "react-icons/ci";
import { MdLocationOn, MdWorkOutline } from "react-icons/md";
import Header from "./HeaderComponents/Header";
import Footer from "./HeaderComponents/Footer";
import "./HeaderComponents/Footer.css";

// 🔹 Convert backend final_score (0–1) to %
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
        const res = await fetch("http://localhost:5000/recommendations"); // update URL
        const data = await res.json();

        // 🔹 Map recommendations to internship format
        const formatted = data.recommendations.map((rec, index) => ({
          id: index + 1,
          title: rec.title,
          company: rec.company_name,
          type: rec.workmode || "Not Specified",
          duration: rec.duration || "Not Specified",
          stipend: rec.stipend || "N/A",
          location: rec.location,
          details: `Skills required: ${rec.skills}`,
          domain: rec.domain,
          matchPercentage: normalizeScore(rec.final_score),
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
    <div className="discover-container">
      <Header />

      {/* 🔍 Filters */}
      <div className="filters">
        {/* Search Bar */}
        <div className="input-icon">
          <CiSearch className="icon" />
          <input
            type="text"
            placeholder="Search internships..."
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
            placeholder="Filter by location..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
      </div>

      {/* Internship Cards */}
      <div className="internship-list">
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
      </div>

      <div className="discoverFooter">
        <Footer />
      </div>
    </div>
  );
};

export default Discover;

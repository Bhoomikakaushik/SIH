import React, { useState, useEffect } from "react";
import "../App.css";
import Header from "./HeaderComponents/Header";
import { useContext } from "react";
import { AuthContext } from "../AuthContext";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user } = useContext(AuthContext);

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    age: "",
    skills: "",
    qualification: "",
    gender: "",
    reservation_status: "",
    sector_interests: "",
    category: "",
    region: "",
    past_participation: "",
    resume: null,
    profileImage: null,
  });

  useEffect(() => {
    if (user) {
      setProfile({
        fullName: user.name || "",
        email: user.email || "",
        phone: user.contact || "",
        location: user.location?.[0] || "",
        age: user.dob
          ? new Date().getFullYear() - new Date(user.dob).getFullYear()
          : "",
        skills: user.skills ? user.skills.join(", ") : "",
        qualification: user.qualifications ? user.qualifications.join(", ") : "",
        gender: user.gender || "",
        reservation_status: user.reservation_status ? "Yes" : "No",
        sector_interests: user.sector_interests
          ? user.sector_interests.join(", ")
          : "",
        category: user.category || "",
        region: user.region || "",
        past_participation: user.past_participation ? "Yes" : "No",
        profileImage: null,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "resume" || name === "profileImage") {
      setProfile({ ...profile, [name]: files[0] });
    } else {
      setProfile({ ...profile, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Profile updated successfully!");
  };

  // useEffect(() => {
  //   if (activeTab === "applications" && profile.skills) {
  //     setLoading(true);
  //     fetch(`http://localhost:5000/api/applications?skills=${profile.skills}`)
  //       .then((res) => res.json())
  //       .then((data) => {
  //         setApplications(data);
  //         setLoading(false);
  //       })
  //       .catch((err) => {
  //         console.error("Error fetching applications:", err);
  //         setLoading(false);
  //       });
  //   }
  // }, [activeTab, profile.skills]);

  return (
    <div>
      <Header />
      <div className="profile-container">
        <div className="profile-form-wrapper">
          <h2>Account Setting</h2>
          <div className="tabs">
            <div
              className={`tab ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              Profile
            </div>
            {/* <div
              className={`tab ${activeTab === "applications" ? "active" : ""}`}
              onClick={() => setActiveTab("applications")}
            >
              Applications
            </div> */}
          </div>

          {activeTab === "profile" && (
            <>
              <div className="image-upload">
                <label htmlFor="profileImage">
                  {profile.profileImage ? (
                    <img
                      src={URL.createObjectURL(profile.profileImage)}
                      alt="Profile"
                      className="preview-img"
                    />
                  ) : (
                    <div className="placeholder-img">Upload Image</div>
                  )}
                </label>
                <input
                  type="file"
                  id="profileImage"
                  name="profileImage"
                  accept="image/*"
                  onChange={handleChange}
                  hidden
                />
              </div>

              <form className="profile-form" onSubmit={handleSubmit}>
                <label className="profile-label">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={profile.fullName}
                  onChange={handleChange}
                  required
                />

                <label className="profile-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  required
                />

                <label className="profile-label">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  required
                />

                <label className="profile-label">Location</label>
                <input
                  type="text"
                  name="location"
                  value={profile.location}
                  onChange={handleChange}
                  required
                />

                <label className="profile-label">Age</label>
                <input
                  type="number"
                  name="age"
                  value={profile.age}
                  onChange={handleChange}
                  required
                />

                <label className="profile-label">Skills</label>
                <input
                  type="text"
                  name="skills"
                  value={profile.skills}
                  onChange={handleChange}
                  required
                />

                <label className="profile-label">Qualification</label>
                <input
                  type="text"
                  name="qualification"
                  value={profile.qualification}
                  onChange={handleChange}
                />

                <label className="profile-label">Gender</label>
                <input
                  type="text"
                  name="gender"
                  value={profile.gender}
                  onChange={handleChange}
                />

                <label className="profile-label">Reservation Status</label>
                <input
                  type="text"
                  name="reservation_status"
                  value={profile.reservation_status}
                  onChange={handleChange}
                />

                <label className="profile-label">Sector Interests</label>
                <input
                  type="text"
                  name="sector_interests"
                  value={profile.sector_interests}
                  onChange={handleChange}
                />

                <label className="profile-label">Category</label>
                <input
                  type="text"
                  name="category"
                  value={profile.category}
                  onChange={handleChange}
                />

                <label className="profile-label">Region</label>
                <input
                  type="text"
                  name="region"
                  value={profile.region}
                  onChange={handleChange}
                />

                <label className="profile-label">Past Participation</label>
                <input
                  type="text"
                  name="past_participation"
                  value={profile.past_participation}
                  onChange={handleChange}
                />

                <div className="button-container">
                  <button type="submit">Save</button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

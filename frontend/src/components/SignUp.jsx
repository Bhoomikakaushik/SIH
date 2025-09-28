import React, { useState } from "react";
import "../App.css";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext.jsx"; 
import { useContext } from "react";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "", // ✅ added password
    contact: "",
    dob: "",
    gender: "",
    education_level: "",
    title:"",
    domain:"",
    region: "",
    location: "",
    skills: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser, setToken } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // ✅ Transform data for backend
    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      contact: formData.contact,
      dob: formData.dob,
      gender: formData.gender,
      education_level: formData.education_level,
      title:formData.title,
      domain:formData.domain,
      region: formData.region,
      location: formData.location ? [formData.location] : [],
      skills: formData.skills ? formData.skills.split(",").map((s) => s.trim()) : [],
      qualifications: [],
      sector_interests: [],
      reservation_status: false,
      category: null,
      past_participation: false,
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || "Signup failed. Please try again.");
      } else {
        // ✅ Store in localStorage
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user));

        setUser(data.user);
        setToken(data.access_token);
        navigate("/dashboard");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container signup-container">
      <div className="login-form">
        <div className="form-box">
          <h2>Join PM Internship Scheme!</h2>
          <p className="sub-text">Create your account to explore opportunities</p>

          {error && <p className="error-text">{error}</p>}

          <form onSubmit={handleSubmit}>
            <label>Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />

            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />

            <label>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />

            <label>Contact</label>
            <input type="text" name="contact" value={formData.contact} onChange={handleChange} required />

            <label>Date of Birth</label>
            <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />

            <label>Gender</label>
            <select name="gender" value={formData.gender} placeholder="Select Gender" onChange={handleChange} required>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>

            <label>Education Level</label>
            <input
              type="text"
              name="education_level"
              value={formData.education_level}
              onChange={handleChange}
              required
              placeholder="E.g. B.Tech, B.Sc, etc."
            />

            <label>Title</label>
            <input
              type="text"
              name="title"
              // value={formData.skills}
              // onChange={handleChange}
              placeholder="Web Development"
            />

            <label>Region</label>
            <select name="region" value={formData.region} onChange={handleChange} required>
              <option value="">Select Region</option>
              <option value="Rural">Rural</option>
              <option value="Urban">Urban</option>
            </select>

            <label>Location</label>
            <input type="text" name="location" value={formData.location} onChange={handleChange} required />

            <label>Skills</label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="E.g. React, Python, Excel"
            />

            <label>Domain</label>
            <input
              type="text"
              name="domain"
              // value={formData.skills}
              // onChange={handleChange}
              placeholder="Web Development"
            />



            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>

          <p className="register-text">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;


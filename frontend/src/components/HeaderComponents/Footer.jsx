import React from "react";
import "./Footer.css";
import { Users, Building } from "lucide-react";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Left Section */}
        <div className="footer-left">
          <div className="footer-logo">
            <div className="logo-box">
              <Building className="logo-icon" />
            </div>
            <div>
              <h3>PM Internship Scheme</h3>
              <p>Smart Matching System</p>
            </div>
          </div>
          <p className="footer-desc">
            Empowering students with AI-driven internship matching for better career outcomes.
          </p>
        </div>

        {/* Middle Sections */}
        <div className="footer-links">
          <div>
            <h4>For Students</h4>
            <ul>
              <li><a href="#">Register Now</a></li>
              <li><a href="#">Browse Opportunities</a></li>
              <li><a href="#">Application Status</a></li>
              <li><a href="#">Career Guidance</a></li>
            </ul>
          </div>

          <div>
            <h4>For Employers</h4>
            <ul>
              <li><a href="#">Post Opportunities</a></li>
              <li><a href="#">View Candidates</a></li>
              <li><a href="#">Analytics Dashboard</a></li>
              <li><a href="#">Partner with Us</a></li>
            </ul>
          </div>

          <div>
            <h4>Support</h4>
            <ul>
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Text */}
      <div className="footer-bottom">
        <p>© 2025 PM Internship Scheme - Smart Matching System. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
import { Users, Building, Home, LayoutDashboard, Compass, Bot } from "lucide-react";
import { NavLink } from "react-router-dom";
import "./Header.css";

const Header = () => {
  return (
    <>
      {/* Top Header */}
      <header className="header">
        <div className="header-container">
          <div className="header-left">
            <div className="logo-box">
              <Building className="logo-icon" />
            </div>
            <div>
              <h1 className="title">PM Internship Scheme</h1>
              <p className="subtitle">Smart Matching System</p>
            </div>
          </div>

          <nav className="nav">
            <NavLink to="/" end>Home</NavLink>
            <NavLink to="/Dashboard">Dashboard</NavLink>
            <NavLink to="/Discover">Discover</NavLink>
            <NavLink to="/SmartAssistant">AI</NavLink>
          </nav>

          <div className="header-right">
            <NavLink to="/profile">
              <button className="profile-btn">
                <Users className="btn-icon" />
                Profile
              </button>
            </NavLink>
          </div>
        </div>
      </header>

      {/* Bottom nav (mobile only) */}
      <nav className="bottom-nav">
        <NavLink to="/" end><Home size={24} strokeWidth={3}/> <span>Home</span></NavLink>
        <NavLink to="/Dashboard"><LayoutDashboard size={24} strokeWidth={3}/> <span>Dashboard</span></NavLink>
        <NavLink to="/Discover"><Compass size={24} strokeWidth={3}/> <span>Discover</span></NavLink>
        <NavLink to="/SmartAssistant"><Bot size={24} strokeWidth={3}/> <span>AI</span></NavLink>
      </nav>
    </>
  );
};

export default Header;

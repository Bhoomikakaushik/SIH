import { Users, Building, Home, LayoutDashboard, Compass, Bot } from "lucide-react";
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from "react";
import "./Header.css";
import { AuthContext } from "../../AuthContext.jsx";


const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login"); // redirect after logout
  };
  
  return (
    <>
      {/* Top Header */}
      <header className="header">
        <div className="header-container">
          <div className="header-left">
            <div className="logo-box">
              <Building clasName="logo-icon" />
            </div>
            <div>
              <h1 className="title">PM Internship Scheme</h1>
              <p className="subtitle">Smart Matching System</p>
            </div>
          </div>

          {/* Desktop nav */}
          <nav className="nav">
            <Link to="/">Home</Link>
            <Link to="/Dashboard">Dashboard</Link>
            <Link to="/Discover">Discover</Link>
            <Link to="/SmartAssistant">AI</Link>
          </nav>

          <div className="header-right">
            <Link to="/profile">
              <button className="profile-btn">
                <Users className="btn-icon" />
                Profile
              </button>
            </Link>
              <button className="profile-btn" onClick={handleLogout}>
                <Users className="btn-icon" />                
                Logout
              </button>
          </div>
        </div>
      </header>

      {/* Bottom nav (mobile only) */}
      <nav className="bottom-nav">
        <Link to="/"><Home size={24} strokeWidth={3}/> <span>Home</span></Link>
        <Link to="/Dashboard"><LayoutDashboard size={24} strokeWidth={3}/> <span>Dashboard</span></Link>
        <Link to="/Discover"><Compass size={24} strokeWidth={3}/> <span>Discover</span></Link>
        <Link to="/SmartAssistant"><Bot size={24} strokeWidth={3}/> <span>AI</span></Link>
      </nav>
    </>
  );
};

export default Header;

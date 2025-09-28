import { useState, useEffect, useContext } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card.jsx";
import Progress from "../ui/progress.jsx";
import { Badge } from "../ui/badge.jsx";
import {
  Users,
  Building2,
  MapPin,
  Star,
  TrendingUp,
  Filter,
  Search,
  Zap,
} from "lucide-react";
import "./MainDashboard.css";
import { AuthContext } from "../../AuthContext.jsx";
import { useNavigate } from "react-router-dom";
// 🔹 Convert backend final_score (0–1) to % 
const normalizeScore = (score) => Math.round(score * 100);

const MainDashboard = () => {
  const [topMatches, setTopMatches] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [lang, setLang] = useState("en");

  // Fetch internships from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://127.0.0.1:8000/search/internships", {
          headers: {
            Authorization: `Bearer ${token}`,
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
          setTopMatches([]);
          return;
        }

        // format into dashboard-style cards
        const formatted = recs.map((rec, index) => ({
          id: index + 1,
          company: rec.company_name,
          position: rec.title,
          location: rec.location,
          matchScore: normalizeScore(rec.final_score || 0),
          sector: rec.domain,
          skills: rec.skills ? rec.skills.split(",") : [],
          diversity: rec.reservation_status
            ? "Reservation Benefits Available"
            : "General",
          stipend: rec.stipend || "N/A",
        }));

        setTopMatches(formatted);
      } catch (error) {
        console.error("❌ Error fetching internships:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <section className="dashboard">
      <div className="dashboard-container">
        {/* Greeting Card */}
        <div className="language-greeting">
          <div className="greeting-card">
            <div>
              <h2 className="greeting-title">Welcome, {user?.name || "User"}</h2>
              <p className="greeting-subtitle">
                Ready to explore internships and boost your career?
              </p>
            </div>
            <div className="points-card">⭐ 100 Points</div>          
          </div>
          <div className="lang-dropdown">
              <select value={lang} onChange={(e) => setLang(e.target.value)}>
                <option value="en">English</option>
                  <option value="hi">हिन्दी</option>
                  <option value="bn">বাংলা</option> 
                  <option value="mr">मराठी</option>
                  <option value="gu">ગુજરાતી</option>
              </select>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <Card className="stat-card">
            <CardHeader>
              <CardTitle>
                <div className="card-title">
                  <Users className="icon primary" />
                  Total Candidates
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="stat-number">12,847</div>
              <div className="stat-sub">
                <TrendingUp className="inline-icon" />
                +15% this month
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardHeader>
              <CardTitle>
                <div className="card-title">
                  <Building2 className="icon secondary" />
                  Active Opportunities
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="stat-number">1,234</div>
              <div className="stat-sub">
                <TrendingUp className="inline-icon" />
                +8% this week
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardHeader>
              <CardTitle>
                <div className="card-title">
                  <Zap className="icon primary" />
                  Matches Made
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="stat-number">8,956</div>
              <div className="stat-sub">
                <TrendingUp className="inline-icon" />
                +23% success rate
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardHeader>
              <CardTitle>
                <div className="card-title">
                  <Star className="icon secondary" />
                  Avg. Match Score
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="stat-number">87%</div>
              <div className="stat-sub">
                <TrendingUp className="inline-icon" />
                +5% improvement
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="main-grid">
          <div className="matches">
            <Card>
              <CardHeader>
                <div className="matches-header">
                  <CardTitle>Top Matches for You</CardTitle>
                  {/* <div className="matches-actions">
                    <button variant="outline" size="sm">
                      <Filter className="btn-icon" /> Filter
                    </button>
                    <button variant="outline" size="sm">
                      <Search className="btn-icon" /> Search
                    </button>
                  </div> */}
                </div>
              </CardHeader>
              <CardContent>
                {topMatches.length > 0 ? (
                  topMatches.slice(0, 3).map((match) => (
                    <div key={match.id} 
                        className="match-card"
                        onClick={() => navigate("/Discover")}
                        style={{ cursor: "pointer" }}>
                      <div className="match-top">
                        <div>
                          <h3>{match.position}</h3>
                          <p>{match.company}</p>
                        </div>
                        <div className="match-score">
                          <div>{match.matchScore}%</div>
                          <small>Match Score</small>
                        </div>
                      </div>

                      <div className="match-info">
                        <MapPin className="inline-icon" />
                        <span className="match-location">{match.location}</span>
                        <Badge variant="outline" className="match-sector">{match.sector}</Badge>
                        <div className="stipend">
                          ₹{match.stipend}/month
                        </div>
                      </div>
                      
                      <div className="match-skills">
                        <div className="skills-progress">
                          <span>Skills Match:</span>
                          <Progress value={match.matchScore} />
                        </div>
                        <div className="skills-list">
                          {match.skills.map((skill, index) => (
                            <Badge
                              className="match-skill"
                              key={index}
                              variant="secondary"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="match-footer">
                        <div className="diversity">
                          <Star className="inline-icon secondary" />
                          <span className="match-diversity">
                            {match.diversity}
                          </span>
                        </div>
                        <button className="match-btn">Apply Now</button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No matches found 🚫</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="side-panel">
            <Card>
              <CardHeader>
                <CardTitle>Matching Criteria</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="criteria">
                  <div className="criteria-row">
                    <span>Skills Alignment</span>
                    <span>92%</span>
                  </div>
                  <Progress value={92} className="progress" />
                </div>
                <div className="criteria">
                  <div className="criteria-row">
                    <span>Location Preference</span>
                    <span>100%</span>
                  </div>
                  <Progress value={100} className="progress" />
                </div>
                <div className="criteria">
                  <div className="criteria-row">
                    <span>Sector Interest</span>
                    <span>87%</span>
                  </div>
                  <Progress value={87} className="progress" />
                </div>
                <div className="criteria">
                  <div className="criteria-row">
                    <span>Diversity Factors</span>
                    <span>95%</span>
                  </div>
                  <Progress value={95} className="progress" />
                </div>
              </CardContent>
            </Card>

            <Card className="affirmative-card">
              <CardHeader>
                <CardTitle>Affirmative Action Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="affirmative-list">
                  <div>
                    <span>Rural Background</span>
                    <Badge variant="secondary">Eligible</Badge>
                  </div>
                  <div>
                    <span>Category: SC/ST</span>
                    <Badge variant="secondary">Verified</Badge>
                  </div>
                  <div>
                    <span>First Generation Graduate</span>
                    <Badge variant="secondary">Yes</Badge>
                  </div>
                </div>
                {/* <button className="update-btn">Update Information</button> */}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MainDashboard;

import React from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* Title */}
      <h1 className="app-title">NavAssist</h1>
      <p className="app-subtitle">Your accessibility companion</p>

      {/* Mic Section */}
      <div className="mic-section">
        <div className="mic-button">
          <span role="img" aria-label="mic" style={{ fontSize: "2rem" }}>🎤</span>
        </div>
        <button className="mic-label">Tap to speak</button>
      </div>

      {/* Features */}
      <div className="features-grid">
        <div className="feature-card" onClick={() => navigate("/navigation")}>
          <h3>Navigation</h3>
          <p>Voice-guided directions to your destination</p>
        </div>
        <div className="feature-card" onClick={() => navigate("/detection")}>
          <h3>Obstacle</h3>
          <p>Real-time detection of nearby obstacles</p>
        </div>
        <div className="feature-card" onClick={() => navigate("/sos")}>
          <h3>SOS</h3>
          <p>Quick access to emergency contacts</p>
        </div>
        <div className="feature-card" onClick={() => navigate("/report")}>
          <h3>Report</h3>
          <p>Report accessibility issues in your area</p>
        </div>
      </div>

      {/* Bottom Navbar */}
      <div className="bottom-nav">
        <div className="nav-item active">Home</div>
        <div className="nav-item">Settings</div>
        <div className="nav-item">Profile</div>
      </div>
    </div>
  );
}

export default HomePage;

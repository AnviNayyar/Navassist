import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { speakText } from '../utils/speech';

import "../App.css";

function HomePage() {
  const navigate = useNavigate();
  // Get the microphone controls from the central context
  const { listening, startListening, stopListening } = useContext(UserContext);

  const handleMicClick = () => {
    if (listening) {
      stopListening();
      speakText('Microphone off');
    } else {
      startListening();
    }
  };

  return (
    <div className="home-container">
      <h1 className="app-title">NavAssist</h1>
      <p className="app-subtitle">Your accessibility companion</p>

      {/* Mic Section now uses the central logic */}
      <div className="mic-section">
        <div 
          className={`mic-button ${listening ? 'listening-effect' : ''}`}
          onClick={handleMicClick}
          aria-label="Tap to speak"
        >
          <span role="img" aria-label="mic" style={{ fontSize: "2rem" }}>🎤</span>
        </div>
        <p className="mic-label-text">{listening ? 'Listening...' : 'Tap to speak'}</p>
      </div>

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

      <div className="bottom-nav">
        <div className="nav-item active" onClick={() => navigate('/')}>Home</div>
        <div className="nav-item" onClick={() => navigate('/settings')}>Settings</div>
        <div className="nav-item" onClick={() => navigate('/profile')}>Profile</div>
      </div>
    </div>
  );
}

export default HomePage;
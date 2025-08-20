import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import NavigationPage from "./pages/NavigationPage";
import DetectionPage from "./pages/DetectionPage";
import SosPage from "./pages/SosPage";
import VoiceHandler from "./components/VoiceHandler";
import ReportPage from "./pages/ReportPage";

function App() {
  return (
    <Router>
      <VoiceHandler />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/navigation" element={<NavigationPage />} />
        <Route path="/detection" element={<DetectionPage />} />
        <Route path="/sos" element={<SosPage />} />
        <Route path="/report" element={<ReportPage />} />
      </Routes>
    </Router>
  );
}

export default App;

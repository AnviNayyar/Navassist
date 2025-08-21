import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserContext, UserProvider } from './context/UserContext';

// Import all your components
import VoiceHandler from './components/VoiceHandler';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
// Assuming you have these other pages, add imports for them
import HomePage from './pages/HomePage';import SettingsPage from './pages/SettingsPage';
import SosPage from './pages/SosPage';

const AppContent = () => {
  const { user } = useContext(UserContext);

  return (
    <>
      {/* THIS IS THE KEY: The "Ears" (VoiceHandler) are only added if a user is logged in */}
      {user && <VoiceHandler />}
      
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/login" />} />
        
        {/* Add your other routes here */}
        <Route path="/home" element={user ? <HomePage /> : <Navigate to="/login" />} /> 
        <Route path="/settings" element={user ? <SettingsPage /> : <Navigate to="/login" />} /> 
        <Route path="/sos" element={user ? <SosPage /> : <Navigate to="/login" />} /> 
        
        {/* This will be the default page */}
        <Route path="*" element={<Navigate to={user ? "/profile" : "/login"} />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    // The Provider wraps everything so the login state can be shared
    <UserProvider>
      <Router>
        <AppContent />
      </Router>
    </UserProvider>
  );
}

export default App;
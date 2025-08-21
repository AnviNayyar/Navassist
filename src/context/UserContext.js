// context/UserContext.js
import React, { createContext, useState, useEffect } from 'react';
import SpeechRecognition from 'react-speech-recognition';

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [listening, setListening] = useState(false);

  useEffect(() => {
    // Load user from localStorage on app start
    const storedUser = localStorage.getItem('app_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Speech recognition event handlers
    const handleStart = () => setListening(true);
    const handleEnd = () => setListening(false);

    SpeechRecognition.onstart = handleStart;
    SpeechRecognition.onend = handleEnd;

    return () => {
      // Cleanup event handlers when context unmounts
      SpeechRecognition.onstart = null;
      SpeechRecognition.onend = null;
    };
  }, []);

  // User login
  const login = (userData) => {
    localStorage.setItem('app_user', JSON.stringify(userData));
    setUser(userData);
  };

  // User logout
  const logout = () => {
    localStorage.removeItem('app_user');
    setUser(null);
    stopListening();  // Stop listening on logout, just in case
  };

  // Start speech recognition
  const startListening = () => {
    SpeechRecognition.startListening({ continuous: true, language: 'en-IN' });
    setListening(true);
  };

  // Stop speech recognition
  const stopListening = () => {
    SpeechRecognition.stopListening();
    setListening(false);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        login,
        logout,
        listening,
        startListening,
        stopListening,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

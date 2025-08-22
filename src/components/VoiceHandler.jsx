import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const VoiceHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const lastActionAt = useRef(0);

  const sendEmergencySMS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const emergencyMessage = encodeURIComponent(
          `Emergency! I need help. My location: https://maps.google.com/?q=${latitude},${longitude}`
        );
        const emergencyNumber = '1234567890';
        const smsLink = `sms:${emergencyNumber}?&body=${emergencyMessage}`;
        window.open(smsLink);
      },
      () => {
        alert('Unable to retrieve your location');
      }
    );
  };

  const commands = [
    { command: ['profile', 'open profile'], callback: () => navigate('/profile') },
    { command: ['settings', 'open settings'], callback: () => navigate('/settings') },
    { command: ['sos', 'emergency', 'help me'], callback: () => sendEmergencySMS() },
    { command: ['navigate', 'open navigation', 'home'], callback: () => navigate('/home') },
    { command: 'back', callback: () => navigate(-1) },
  ];

  const { transcript, browserSupportsSpeechRecognition } = useSpeechRecognition({ commands });

  useEffect(() => {
    if (browserSupportsSpeechRecognition) {
      SpeechRecognition.startListening({ continuous: true, language: 'en-IN' });
    }
    return () => {
      SpeechRecognition.stopListening();
    };
  }, [browserSupportsSpeechRecognition]);

  useEffect(() => {
    if (!transcript) return;

    const text = transcript.toLowerCase().trim();
    const now = Date.now();

    if (now - lastActionAt.current < 1200) return; // 1.2s debounce

    const goHome = text.includes("home") || text.includes("main") || text.includes("start");
    const goBack = text.includes("back") || text.includes("go back");
    const goNav = text.includes("navigate") || text.includes("navigation") || text.includes("route");
    const goDetect = text.includes("detect") || text.includes("detection") || text.includes("object");
    const goSOS = text.includes("sos") || text.includes("emergency") || text.includes("help");
    const goReport = text.includes("report") || text.includes("report issue");

    if (goHome) {
      navigate("/");
    } else if (goBack && location.pathname !== "/") {
      navigate("/");
    } else if (goNav) {
      navigate("/navigation");
    } else if (goDetect) {
      navigate("/detection");
    } else if (goSOS) {
      navigate("/sos");
    } else if (goReport) {
      navigate("/report");
    }

    lastActionAt.current = now;
  }, [transcript, navigate, location.pathname]);

  return null;
};

export default VoiceHandler;

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const VoiceHandler = () => {
  const navigate = useNavigate();

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

        // Default emergency number, can be changed or pulled from user context
        const emergencyNumber = '1234567890';

        // This SMS URI scheme works on most mobiles
        const smsLink = `sms:${emergencyNumber}?&body=${emergencyMessage}`;

        window.open(smsLink);
      },
      (error) => {
        alert('Unable to retrieve your location');
      }
    );
  };

  const commands = [
    { command: ['profile', 'open profile'], callback: () => navigate('/profile') },
    { command: ['settings', 'open settings'], callback: () => navigate('/settings') },
    { 
      command: ['sos', 'emergency', 'help me'], 
      callback: () => sendEmergencySMS() 
    },
    { command: ['navigate', 'open navigation', 'home'], callback: () => navigate('/home') },
    { command: 'back', callback: () => navigate(-1) },
  ];

  const { browserSupportsSpeechRecognition } = useSpeechRecognition({ commands });

  useEffect(() => {
    if (browserSupportsSpeechRecognition) {
      SpeechRecognition.startListening({ continuous: true, language: 'en-IN' });
    }
    return () => {
      SpeechRecognition.stopListening();
    };
  }, [browserSupportsSpeechRecognition]);

  return null;
};

export default VoiceHandler;

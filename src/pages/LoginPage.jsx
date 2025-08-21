import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

// Import your UserContext and the speakText helper function
import { UserContext } from '../context/UserContext';
import { speakText } from '../utils/speech';

const LoginPage = () => {
  const [name, setName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [emergencyContactNumber, setEmergencyContactNumber] = useState('');
  const [message, setMessage] = useState('Click the mic to begin.');

  const { login } = useContext(UserContext);
  const navigate = useNavigate();

  // Helper to format spoken numbers (e.g., "one two three" -> "123")
  const formatSpokenNumber = (spokenNumber) => {
    return spokenNumber.replace(/\s/g, '');
  };

  const commands = [
    {
      command: 'name *',
      callback: (spokenName) => {
        setName(spokenName);
        speakText(`Name set to ${spokenName}. Now, say "contact number" followed by your number.`);
        setMessage(`Name: ${spokenName}. Next, provide your contact number.`);
        resetTranscript();
      },
    },
    {
      command: 'contact number *',
      callback: (spokenNumber) => {
        const formattedNumber = formatSpokenNumber(spokenNumber);
        setContactNumber(formattedNumber);
        speakText(`Contact number set. Now, say "emergency contact" followed by the number.`);
        setMessage(`Contact: ${formattedNumber}. Next, provide the emergency contact.`);
        resetTranscript();
      },
    },
    {
      command: 'emergency contact *',
      callback: (spokenNumber) => {
        const formattedNumber = formatSpokenNumber(spokenNumber);
        setEmergencyContactNumber(formattedNumber);
        speakText(`Emergency contact set. Say "submit" to continue.`);
        setMessage(`Emergency Contact: ${formattedNumber}. Say "submit" to continue.`);
        resetTranscript();
      },
    },
    {
      command: ['submit', 'login', 'start session'],
      callback: () => {
        document.getElementById('loginButton').click();
        resetTranscript();
      },
      isFuzzyMatch: true,
    },
    {
      command: 'clear',
      callback: () => {
        setName('');
        setContactNumber('');
        setEmergencyContactNumber('');
        speakText('Form cleared.');
        setMessage('Click the mic to begin.');
        resetTranscript();
      },
    },
  ];

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition({ commands });

  // This useEffect now only gives a welcome message and handles cleanup.
  // It no longer starts listening automatically.
  useEffect(() => {
    speakText('Welcome. Please click the microphone button to start entering your details.');
    // This cleanup function will stop listening if the user navigates away
    return () => {
      SpeechRecognition.stopListening();
    };
  }, []);

  // Correctly handles toggling the microphone on and off
  const handleMicClick = () => {
    if (listening) {
      SpeechRecognition.stopListening();
      setMessage('Microphone is off. Click it to start again.');
    } else {
      // Start listening in continuous mode
      SpeechRecognition.startListening({ continuous: true, language: 'en-IN' });
      setMessage('Microphone is on. Please say your name.');
    }
  };
  
  // Handles the final form submission
  const handleLogin = () => {
  if (name && contactNumber && emergencyContactNumber) {
    speakText(`Starting session for ${name}. Redirecting to homepage.`);
    login({ name, contactNumber, emergencyContactNumber });

    // 👇 Go to your friend's HomePage.jsx
    navigate('/home');
  } else {
    speakText('All fields are required. Please provide all details.');
  }
};

  if (!browserSupportsSpeechRecognition) {
    return <span>Error: Browser does not support speech recognition.</span>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '50px', fontFamily: 'sans-serif' }}>
      
      <div style={{ padding: '40px', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', minWidth: '350px' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Enter Your Details</h1>
        
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="name-input" style={{ display: 'block', marginBottom: '5px' }}>Name:</label>
          <input
            id="name-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Say 'name [your_name]'"
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="contact-input" style={{ display: 'block', marginBottom: '5px' }}>Contact Number:</label>
          <input
            id="contact-input"
            type="tel"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            placeholder="Say 'contact number [number]'"
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
          />
        </div>
        
        <div style={{ marginBottom: '30px' }}>
          <label htmlFor="emergency-contact-input" style={{ display: 'block', marginBottom: '5px' }}>Emergency Contact Number:</label>
          <input
            id="emergency-contact-input"
            type="tel"
            value={emergencyContactNumber}
            onChange={(e) => setEmergencyContactNumber(e.target.value)}
            placeholder="Say 'emergency contact [number]'"
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
          />
        </div>
        
        <button
          id="loginButton"
          onClick={handleLogin}
          style={{ width: '100%', padding: '12px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Start Session
        </button>
      </div>

      <div style={{ marginTop: '30px', border: '1px solid #ccc', padding: '15px', borderRadius: '8px', minWidth: '350px', backgroundColor: '#f9f9f9', textAlign: 'center' }}>
        <h3 style={{ marginTop: '0', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Voice Control</h3>
        <button onClick={handleMicClick} style={{ fontSize: '16px', padding: '10px 20px', cursor: 'pointer', marginBottom: '15px', backgroundColor: listening ? '#dc3545' : '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}>
          {listening ? 'Turn Mic Off' : 'Turn Mic On'}
        </button>
        <p><strong>Status:</strong> {message}</p>
        <p><strong>You Said:</strong> <em style={{ color: '#555' }}>{transcript}</em></p>
      </div>

    </div>
  );
};

export default LoginPage;
import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import { speakText } from '../utils/speech';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const SettingsPage = () => {
  const { user, updateUser } = useContext(UserContext);
  const [newUsername, setNewUsername] = useState(user ? user.username : '');
  const [message, setMessage] = useState('');

  // Voice commands for this page
  const commands = [
    {
      // Example: "change username to new_user"
      command: 'change username to *',
      callback: (spokenUsername) => {
        setNewUsername(spokenUsername);
        speakText(`Username ready to be changed to ${spokenUsername}. Say "save changes" to confirm.`);
      }
    },
    {
      command: ['save changes', 'save'],
      callback: () => document.getElementById('saveButton').click(), // Programmatically click the button
    }
  ];

  const { browserSupportsSpeechRecognition } = useSpeechRecognition({ commands });

  useEffect(() => {
    SpeechRecognition.startListening({ continuous: true });
    return () => SpeechRecognition.stopListening();
  }, []);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    updateUser({ username: newUsername });
    const successMsg = `Username successfully changed to ${newUsername}.`;
    setMessage(successMsg);
    speakText(successMsg);
  };
  
  if (!user) {
    return <p>Please log in to change settings.</p>;
  }
  
  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <div>
      <h1>Settings</h1>
      <p>Here you can change your user information.</p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="username">Change Username:</label>
          <br />
          <input
            id="username"
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            style={{ minWidth: '300px', padding: '8px' }}
          />
        </div>
        <button id="saveButton" type="submit">Save Changes</button>
      </form>
      
      {message && <p style={{ color: 'green', marginTop: '20px' }}>{message}</p>}
    </div>
  );
};

export default SettingsPage;
import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return <p>You are not logged in.</p>;

  return (
    <div style={{ padding: '30px' }}>
      <h1>User Profile 👤</h1>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Contact Number:</strong> {user.contactNumber}</p>
      <p><strong>Emergency Contact:</strong> {user.emergencyContactNumber}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default ProfilePage;
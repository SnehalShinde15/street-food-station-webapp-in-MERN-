import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';
import axios from 'axios';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();




  const handleLogin = (e) => {
    e.preventDefault();
    setError(null);

    if (email === 'admin@gmail.com' && password === 'admin') {
      // Simulate storing a token
      localStorage.setItem('adminToken', 'fake-admin-token');
      // Redirect to the list page
      navigate('/list');
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="admin-login">
      <h2>Admin Login</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default AdminLogin;

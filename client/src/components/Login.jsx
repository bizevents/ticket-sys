import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css'

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Hardcoded credentials (admin and password)
    const adminUsername = 'admin';
    const adminPassword = 'bizadmin';

    // Check if the provided credentials match the admin credentials
    if (username === adminUsername && password === adminPassword) {
      // If successful, save the authentication state in localStorage
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/'); // Redirect to home or any other protected route
    } else {
      // If authentication fails, show an error message
      setErrorMessage('Invalid username or password');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;

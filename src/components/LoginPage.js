import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar'; // Import the Navbar component
import './LoginPage.css';

const LoginPage = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [isVerifyingRobot, setIsVerifyingRobot] = useState(false);
  const [isRobotVerified, setIsRobotVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleVerifyRobot = () => {
    setIsVerifyingRobot(true);
    setTimeout(() => {
      setIsVerifyingRobot(false);
      setIsRobotVerified(true);
    }, 3000); // Simulate a 3-second verification process
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!isRobotVerified) {
      alert('Please confirm you are not a robot!');
      return;
    }

    try {
      const response = await fetch('https://backend-new-misy.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (response.status === 200) {
        setSuccessMessage('Login successful! Redirecting...');
        setErrorMessage('');

        // Store user details in local storage
        localStorage.setItem('userDetails', JSON.stringify(form));

        setTimeout(() => {
          navigate('/verification', { state: { username: form.username, password: form.password } });
        }, 1000);
      } else {
        setErrorMessage(result.message || 'Invalid username or password.');
        setSuccessMessage('');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setErrorMessage('An unexpected error occurred. Please try again later.');
      setSuccessMessage('');
    }
  };

  const handleSignupRedirect = () => {
    navigate('/signup');
  };

  return (
    <div>
      <Navbar /> {/* Add Navbar at the top */}
      <div className="login-container">
        <div className="login-box">
          <div className="word" style={{ color: 'white' }}>LOGIN</div>
          {successMessage && (
            <p className="success-message">{successMessage}</p>
          )}
          {errorMessage && (
            <p className="error-message">{errorMessage}</p>
          )}
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Username:</label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                className="signup-input"
                required
              />
            </div>
            <div className="form-group">
              <label>Password:</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="signup-input"
                required
              />
            </div>
            <div className="form-group robot-verification">
              {isRobotVerified ? (
                <p className="verified-text">✔ Verified!</p>
              ) : isVerifyingRobot ? (
                <div className="bubble-loader">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              ) : (
                <button
                  type="button"
                  className="verify-btn"
                  onClick={handleVerifyRobot}
                >
                  I am not a robot
                </button>
              )}
            </div>
            <button
              type="submit"
              className={`login-btn ${isRobotVerified ? '' : 'disabled'}`}
              disabled={!isRobotVerified}
            >
              Login
            </button>
          </form>
          <p className="account-text">
            Don't have an account?{' '}
            <span className="signup-link" onClick={handleSignupRedirect}>
              Sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
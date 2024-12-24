import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar'; // Import the Navbar component
import './SignupPage.css'; // Link to external CSS

const SignupPage = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
  });
  const [error, setError] = useState(null); // For displaying error messages
  const [successMessage, setSuccessMessage] = useState(null); // For displaying success message
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const validatePassword = (password) => {
    // Corrected regex for strong password
    const strongPasswordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous error if any
    setSuccessMessage(null); // Clear previous success message

    if (!validatePassword(form.password)) {
      setError(
        'Password must be at least 8 characters long, include altleast one uppercase letter, one number, and one special character.'
      );
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form), // Send form data as JSON
      });

      const result = await response.json();

      if (response.ok) {
        setSuccessMessage('Account created successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/login'); // Redirect to login page after 2 seconds
        }, 2000);
      } else {
        setError(result.error || 'Signup failed');
      }
    } catch (error) {
      setError('Failed to connect to the server');
    }
  };

  return (
    <div>
      <Navbar /> {/* Include the Navbar */}
      <div className="signup-container">
        <div className="abc">Create Account</div>
        {error && <p className="error-message">{error}</p>} {/* Display error message */}
        {successMessage && <p className="success-message">{successMessage}</p>} {/* Display success message */}
        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              value={form.firstName}
              onChange={handleChange}
              className="signup-input"
              required
              placeholder="First Name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              value={form.lastName}
              onChange={handleChange}
              className="signup-input"
              required
              placeholder="Last Name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              id="username"
              value={form.username}
              onChange={handleChange}
              className="signup-input"
              required
              placeholder="Username"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              value={form.password}
              onChange={handleChange}
              className="signup-input"
              required
              placeholder="Password"
            />
          </div>
          <button type="submit" className="signup-btn">
            Signup
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;

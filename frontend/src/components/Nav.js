import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Nav.css';
import { FaUserCircle } from 'react-icons/fa';

const Nav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAccountInfo, setShowAccountInfo] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [userDetails, setUserDetails] = useState({ username: 'Guest', password: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = () => {
      const storedDetails = localStorage.getItem('userDetails');
      if (storedDetails) {
        setUserDetails(JSON.parse(storedDetails));
      } else {
        setUserDetails({ username: 'Guest', password: '' });
      }
    };

    fetchUserDetails();

    const handleStorageChange = () => {
      fetchUserDetails();
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('userDetails');
    setUserDetails({ username: 'Guest', password: '' });
    navigate('/');
  };

  const handleNavigate = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  return (
    <>
      <nav className="prime-navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo">
            Signare
          </Link>
        </div>
        <div className="nav-right">
          <div className="profile-container">
            <FaUserCircle
              size={30}
              className="profile-icon"
              onClick={() => setIsMenuOpen((prev) => !prev)}
            />
            {isMenuOpen && (
              <div className="profile-dropdown">
                <p
                  className="dropdown-item"
                  onClick={() => setShowAccountInfo((prev) => !prev)}
                >
                  My Account
                </p>
                <p
                  className="dropdown-item"
                  onClick={() => handleNavigate('/UploadPage')}
                >
                  Upload Page
                </p>
                <p
                  className="dropdown-item"
                  onClick={() => handleNavigate('/verification')}
                >
                  Verify Page
                </p>
                <p
                  className="dropdown-item"
                  onClick={() => handleNavigate('/about-us')}
                >
                  About Us
                </p>
                <button className="signout-button" onClick={handleSignOut}>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {showAccountInfo && (
        <div className="account-popup">
          <p>
            <strong>Username:</strong> {userDetails.username}
          </p>
          <p>
            <strong>Password:</strong>{' '}
            {isPasswordVisible ? userDetails.password : ''}
          </p>
          {/* <button className="toggle-password-btn" onClick={togglePasswordVisibility}>
            {isPasswordVisible ? 'Hide' : 'Show'}
          </button> */}
          <button
            className="close-popup"
            onClick={() => setShowAccountInfo(false)}
          >
            Close
          </button>
        </div>
      )}
    </>
  );
};

export default Nav;
// Navbar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">Signare</Link>
        <div className="dropdown">
          <button className="dropdown-button" onClick={toggleDropdown}>☰</button>
          {dropdownVisible && (
            <ul className="dropdown-menu">
              <li><Link to="/login" onClick={() => setDropdownVisible(false)}>Login</Link></li>
              <li><Link to="/signup" onClick={() => setDropdownVisible(false)}>Signup</Link></li>
              <li><Link to="/UploadPage" onClick={() => setDropdownVisible(false)}>Upload</Link></li>
              <li><Link to="/verification" onClick={() => setDropdownVisible(false)}>Verification</Link></li>
              <li><Link to="/about-us" onClick={() => setDropdownVisible(false)}>About Us</Link></li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
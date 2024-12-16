import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MainPage.css'; // Import CSS for styling

const MainPage = () => {
    const navigate = useNavigate();
  
    const handleGetStarted = () => {
      navigate('/login');
    };
    


  return (
    <div className="container">
      <div className="content">
        <h1 className="title">Welcome To Signature Verification</h1>
        <p className="subtitle">Ensuring every signature is genuine</p>
        <button className="get-started" onClick={handleGetStarted}>Get Started</button>
      </div>
    </div>
  );
};

export default MainPage;
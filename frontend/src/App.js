import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; // Import the Navbar component
import MainPage from './components/MainPage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import VerificationPage from './components/VerificationPage';
import AboutPage from './components/AboutPage';
import UploadPage from './components/UploadPage';
import PrivateRoute from './components/PrivateRoute'; // Import PrivateRoute

const App = () => {
  return (
    <Router>
      {/* Place the Navbar component above the Routes */}
     
      {/* Add Routes for the different pages */}
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/verification"
          element={
            <PrivateRoute>
              <VerificationPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/UploadPage"
          element={
            <PrivateRoute>
              <UploadPage />
            </PrivateRoute>
          }
        />
        <Route path="/about-us" element={<AboutPage />} />
      </Routes>
    </Router>
  );
};

export default App;
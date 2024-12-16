import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const userDetails = JSON.parse(localStorage.getItem('userDetails'));

  return userDetails ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
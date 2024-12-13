import React from 'react';
import { Navigate } from 'react-router-dom';

// ProtectedRoute component that checks if the user is authenticated
const ProtectedRoute = ({ element, ...rest }) => {
  // Check if the user is authenticated by verifying stored credentials in localStorage
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  if (!isAuthenticated) {
    // If not authenticated, redirect to the login page
    return <Navigate to="/login" />;
  }

  // If authenticated, render the protected route element
  return element;
};

export default ProtectedRoute;


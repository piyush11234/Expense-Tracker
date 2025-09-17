import React from "react";
import { Navigate } from "react-router-dom";

// PrivateRoute wrapper component
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token"); // check if user is logged in

  if (!token) {
    // if not logged in, redirect to login
    return <Navigate to="/login" replace />;
  }

  // if logged in, render the children component
  return children;
};

export default PrivateRoute;

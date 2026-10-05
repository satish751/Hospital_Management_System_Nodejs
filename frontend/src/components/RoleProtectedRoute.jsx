import React from "react";
import { Navigate, useLocation } from "react-router-dom";

function RoleProtectedRoute({ children, allowedRole }) {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // No JWT → Login
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // JWT exists but user information is missing
  if (!user) {
    localStorage.removeItem("token");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role doesn't match
  if (user.role !== allowedRole) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-green-50 px-6">
        <div className="rounded-2xl bg-white p-10 text-center shadow-xl">
          <h1 className="text-3xl font-bold text-red-600">
            Access Denied
          </h1>

          <p className="mt-3 text-gray-600">
            You don't have permission to access this page.
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Your role:{" "}
            <span className="font-semibold">{user.role}</span>
          </p>
        </div>
      </div>
    );
  }

  // Token + correct role → Allow access
  return children;
}

export default RoleProtectedRoute;
import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../../services/auth";

interface Props {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}
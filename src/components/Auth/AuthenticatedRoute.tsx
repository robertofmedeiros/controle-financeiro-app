import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../../services/auth";

interface Props {
  children: React.ReactNode;
}

export default function AuthenticatedRoute({ children }: Props) {
  if (isAuthenticated()) {
    return <Navigate to="/transactions" replace />;
  }
  return <>{children}</>;
}
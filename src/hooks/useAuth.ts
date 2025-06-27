import { useCallback } from "react";
import { getUser, isAuthenticated, logout } from "../services/auth";
import { useNavigate } from "react-router-dom";

// Defina o tipo conforme seu payload JWT
export interface UserJWT {
  id: number; // id do usuário
  nome?: string;
  email?: string;
  [key: string]: any;
}

export function useAuth() {
  const navigate = useNavigate();

  const user = getUser() as UserJWT | null;

  const signOut = useCallback(() => {
    logout();
    navigate("/login");
  }, [navigate]);

  return {
    user,
    isAuthenticated: isAuthenticated(),
    signOut,
  };
}
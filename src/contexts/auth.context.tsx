"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { useAuth } from "@/hooks/use-auth.hook";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const {
    login: loginHook,
    logout: logoutHook,
    isAuthenticated: isAuthenticatedHook,
    loading,
    error,
  } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Initialize from localStorage on component mount
    if (typeof window !== "undefined") {
      return isAuthenticatedHook();
    }
    return false;
  });

  const login = async (username: string, password: string) => {
    await loginHook(username, password);
    setIsAuthenticated(true);
  };

  const logout = () => {
    logoutHook();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, loading, error }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}

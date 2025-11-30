"use client";

import { createContext, useContext, ReactNode, useState } from "react";
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
    loading,
    error,
    isAuthenticated: isAuthenticatedCheck,
  } = useAuth();

  const [isAuthenticatedState, setIsAuthenticatedState] = useState(
    isAuthenticatedCheck()
  );

  const login = async (username: string, password: string) => {
    await loginHook(username, password);
    setIsAuthenticatedState(true);
  };

  const logout = () => {
    logoutHook();
    setIsAuthenticatedState(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: isAuthenticatedState,
        login,
        logout,
        loading,
        error,
      }}
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

import { useState, useCallback } from "react";
import { apiClient } from "@/lib/api/client";
import { ApiError } from "@/lib/api/type";

export interface AuthError {
  message: string;
  apiMessage?: string;
  httpCode?: number;
}

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.login(username, password);
      if (typeof window !== "undefined") {
        localStorage.setItem("auth_token", response.token);
      }
      return response;
    } catch (err: unknown) {
      const apiError = err as ApiError;
      const errorMessage = apiError.error || "Login failed";
      const httpCode = apiError.status;
      setError(errorMessage);
      throw { ...apiError, httpCode, errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
    }
  }, []);

  const isAuthenticated = useCallback(() => {
    if (typeof window === "undefined") {
      return false;
    }
    return !!localStorage.getItem("auth_token");
  }, []);

  return {
    login,
    logout,
    isAuthenticated,
    loading,
    error,
  };
}

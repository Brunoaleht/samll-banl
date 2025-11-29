import { useState, useCallback } from "react";
import { apiClient } from "@/lib/api/client";

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
    } catch (err: any) {
      const errorMessage = err.error || "Login failed";
      setError(errorMessage);
      throw err;
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

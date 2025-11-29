import { useState, useCallback } from "react";
import { apiClient } from "@/lib/api/client";

export interface UseAuthResult {
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<{ token: string }>;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export function useAuth(): UseAuthResult {
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
      const errorMessage =
        ((err as Record<string, unknown>)?.error as string) || "Login failed";
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

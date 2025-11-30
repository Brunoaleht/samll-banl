import { useState, useCallback } from "react";
import { apiClient } from "@/lib/api/client";
import { ApiError } from "@/lib/api/type";

export function useAccount() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getBalance = useCallback(async (accountId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.getBalance(accountId);
      return response;
    } catch (err: unknown) {
      const apiError = err as ApiError;
      const errorMessage = apiError.error || "Failed to get balance";
      const httpCode = apiError.status || apiError.httpCode;
      setError(errorMessage);
      throw { ...apiError, httpCode, errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const deposit = useCallback(async (destination: string, amount: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.deposit(destination, amount);
      return response;
    } catch (err: unknown) {
      const apiError = err as ApiError;
      const errorMessage = apiError.error || "Deposit failed";
      const httpCode = apiError.status || apiError.httpCode;
      setError(errorMessage);
      throw { ...apiError, httpCode, errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const withdraw = useCallback(async (origin: string, amount: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.withdraw(origin, amount);
      return response;
    } catch (err: unknown) {
      const apiError = err as ApiError;
      const errorMessage = apiError.error || "Withdraw failed";
      const httpCode = apiError.status;
      setError(errorMessage);
      throw { ...apiError, httpCode, errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const transfer = useCallback(
    async (origin: string, destination: string, amount: number) => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.transfer(origin, destination, amount);
        return response;
      } catch (err: unknown) {
        const apiError = err as ApiError;
        const errorMessage = apiError.error || "Transfer failed";
        const httpCode = apiError.status;
        setError(errorMessage);
        throw { ...apiError, httpCode, errorMessage };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const reset = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.reset();
    } catch (err: unknown) {
      const apiError = err as ApiError;
      const errorMessage = apiError.error || "Reset failed";
      const httpCode = apiError.status;
      setError(errorMessage);
      throw { ...apiError, httpCode, errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    getBalance,
    deposit,
    withdraw,
    transfer,
    reset,
    loading,
    error,
  };
}

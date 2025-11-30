import { useState, useCallback } from "react";
import { apiClient } from "@/lib/api/client";

export function useAccount() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getBalance = useCallback(async (accountId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.getBalance(accountId);
      return response;
    } catch (err: any) {
      const errorMessage = err.error || "Failed to get balance";
      const httpCode = err.status;
      setError(errorMessage);
      throw { ...err, httpCode, errorMessage };
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
    } catch (err: any) {
      const errorMessage = err.error || "Deposit failed";
      const httpCode = err.status;
      setError(errorMessage);
      throw { ...err, httpCode, errorMessage };
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
    } catch (err: any) {
      const errorMessage = err.error || "Withdraw failed";
      const httpCode = err.status;
      setError(errorMessage);
      throw { ...err, httpCode, errorMessage };
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
      } catch (err: any) {
        const errorMessage = err.error || "Transfer failed";
        const httpCode = err.status;
        setError(errorMessage);
        throw { ...err, httpCode, errorMessage };
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
    } catch (err: any) {
      const errorMessage = err.error || "Reset failed";
      const httpCode = err.status;
      setError(errorMessage);
      throw { ...err, httpCode, errorMessage };
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

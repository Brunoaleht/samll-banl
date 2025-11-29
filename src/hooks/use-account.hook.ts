import { useState, useCallback } from "react";
import { apiClient } from "@/lib/api/client";

export interface UseAccountResult {
  balance: number | null;
  loading: boolean;
  error: string | null;
  getBalance: (accountId: string) => Promise<{ balance: number }>;
  deposit: (destination: string, amount: number) => Promise<{ destination: { id: string; balance: number } }>;
  withdraw: (origin: string, amount: number) => Promise<{ origin: { id: string; balance: number } }>;
  transfer: (origin: string, destination: string, amount: number) => Promise<{ origin: { id: string; balance: number }; destination: { id: string; balance: number } }>;
  reset: () => Promise<void>;
}

export function useAccount(): UseAccountResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getBalance = useCallback(async (accountId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.getBalance(accountId);
      return response;
    } catch (err: unknown) {
      const errorMessage = (err as Record<string, unknown>)?.error as string || "Failed to get balance";
      setError(errorMessage);
      throw err;
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
      const errorMessage = (err as Record<string, unknown>)?.error as string || "Deposit failed";
      setError(errorMessage);
      throw err;
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
      const errorMessage = (err as Record<string, unknown>)?.error as string || "Withdraw failed";
      setError(errorMessage);
      throw err;
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
        const errorMessage = (err as Record<string, unknown>)?.error as string || "Transfer failed";
        setError(errorMessage);
        throw err;
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
      const errorMessage = (err as Record<string, unknown>)?.error as string || "Reset failed";
      setError(errorMessage);
      throw err;
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
    balance: null,
  };
}

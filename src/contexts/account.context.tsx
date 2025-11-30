"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { useAccount } from "@/hooks/use-account.hook";

interface Transaction {
  id: string;
  type: "deposit" | "withdraw" | "transfer";
  accountId: string;
  destinationAccountId?: string;
  amount: number;
  timestamp: Date;
}

interface AccountContextType {
  balance: number | null;
  accountId: string | null;
  transactions: Transaction[];
  setAccountId: (id: string) => void;
  loadBalance: () => Promise<void>;
  deposit: (amount: number) => Promise<void>;
  withdraw: (amount: number) => Promise<void>;
  transfer: (destination: string, amount: number) => Promise<void>;
  reset: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export function AccountProvider({ children }: { children: ReactNode }) {
  const {
    getBalance,
    deposit: depositHook,
    withdraw: withdrawHook,
    transfer: transferHook,
    reset: resetHook,
    loading,
    error,
  } = useAccount();

  const [balance, setBalance] = useState<number | null>(null);
  const [accountId, setAccountIdState] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const setAccountId = useCallback((id: string) => {
    setAccountIdState(id);
  }, []);

  const loadBalance = useCallback(async () => {
    if (!accountId) return;
    try {
      const response = await getBalance(accountId);
      setBalance(response.balance);
    } catch (err) {
      console.error("Failed to load balance:", err);
      throw err;
    }
  }, [accountId, getBalance]);

  const deposit = useCallback(
    async (amount: number) => {
      if (!accountId) return;
      try {
        const response = await depositHook(accountId, amount);
        setBalance(response.destination.balance);
        await loadBalance();
      } catch (err) {
        throw err;
      }
    },
    [accountId, depositHook, loadBalance]
  );

  const withdraw = useCallback(
    async (amount: number) => {
      if (!accountId) return;
      try {
        const response = await withdrawHook(accountId, amount);
        setBalance(response.origin.balance);
        await loadBalance();
      } catch (err) {
        throw err;
      }
    },
    [accountId, withdrawHook, loadBalance]
  );

  const transfer = useCallback(
    async (destination: string, amount: number) => {
      if (!accountId) return;
      try {
        const response = await transferHook(accountId, destination, amount);
        setBalance(response.origin.balance);
        await loadBalance();
      } catch (err) {
        throw err;
      }
    },
    [accountId, transferHook, loadBalance]
  );

  const reset = useCallback(async () => {
    try {
      await resetHook();
      setBalance(null);
      setAccountIdState(null);
      setTransactions([]);
    } catch (err) {
      throw err;
    }
  }, [resetHook]);

  return (
    <AccountContext.Provider
      value={{
        balance,
        accountId,
        transactions,
        setAccountId,
        loadBalance,
        deposit,
        withdraw,
        transfer,
        reset,
        loading,
        error,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
}

export function useAccountContext() {
  const context = useContext(AccountContext);
  if (context === undefined) {
    throw new Error("useAccountContext must be used within an AccountProvider");
  }
  return context;
}

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
  accountId: number;
  destinationAccountId?: number;
  amount: number;
  timestamp: Date;
}

interface AccountContextType {
  balance: number | null;
  accountId: number | null;
  transactions: Transaction[];
  setAccountId: (id: number) => void;
  loadBalance: () => Promise<void>;
  loadAccountData: (id: number) => Promise<void>;
  createAccount: (id: number, initialBalance?: number) => Promise<void>;
  deposit: (amount: number) => Promise<void>;
  withdraw: (amount: number) => Promise<void>;
  transfer: (destination: number, amount: number) => Promise<void>;
  reset: () => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export function AccountProvider({ children }: { children: ReactNode }) {
  const {
    getBalance,
    getAccountData,
    createAccount: createAccountHook,
    deposit: depositHook,
    withdraw: withdrawHook,
    transfer: transferHook,
    reset: resetHook,
    loading,
    error,
  } = useAccount();

  const [balance, setBalance] = useState<number | null>(null);
  const [accountId, setAccountIdState] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const setAccountId = useCallback((id: number) => {
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

  const loadAccountData = useCallback(
    async (id: number) => {
      try {
        const response = await getAccountData(id);
        setAccountIdState(id);
        setBalance(response.balance);
      } catch (err) {
        console.error("Failed to load account data:", err);
        throw err;
      }
    },
    [getAccountData]
  );

  const createAccount = useCallback(
    async (id: number, initialBalance?: number) => {
      try {
        const response = await createAccountHook(id, initialBalance);
        setAccountIdState(id);
        setBalance(response.balance);
      } catch (err) {
        console.error("Failed to create account:", err);
        throw err;
      }
    },
    [createAccountHook]
  );

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
    async (destination: number, amount: number) => {
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

  const logout = useCallback(() => {
    setBalance(null);
    setAccountIdState(null);
    setTransactions([]);
  }, []);

  return (
    <AccountContext.Provider
      value={{
        balance,
        accountId,
        transactions,
        setAccountId,
        loadBalance,
        loadAccountData,
        createAccount,
        deposit,
        withdraw,
        transfer,
        reset,
        logout,
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

import { Account, Transaction } from "./types";

export interface IStorageAdapter {
  getAccount(accountId: string): Promise<Account | null>;
  createAccount(accountId: string, initialBalance?: number): Promise<Account>;
  updateAccountBalance(accountId: string, newBalance: number): Promise<Account>;
  addTransaction(
    transaction: Omit<Transaction, "id" | "timestamp">
  ): Promise<Transaction>;
  getTransactions(accountId: string, limit?: number): Promise<Transaction[]>;
  reset(): Promise<void>;
}

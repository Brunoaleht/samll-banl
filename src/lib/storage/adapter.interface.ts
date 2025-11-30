import { Account, Transaction } from "../../types";

export interface IStorageAdapter {
  getAccount(accountId: number): Promise<Account | null>;
  createAccount(accountId: number, initialBalance?: number): Promise<Account>;
  updateAccountBalance(accountId: number, newBalance: number): Promise<Account>;
  addTransaction(
    transaction: Omit<Transaction, "id" | "timestamp">
  ): Promise<Transaction>;
  getTransactions(accountId: number, limit?: number): Promise<Transaction[]>;
  reset(): Promise<void>;
}

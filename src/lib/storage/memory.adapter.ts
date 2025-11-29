import { IStorageAdapter } from "./adapter.interface";
import { Account, Transaction } from "./types";

export class MemoryAdapter implements IStorageAdapter {
  private accounts: Map<string, Account> = new Map();
  private transactions: Transaction[] = [];

  async getAccount(accountId: string): Promise<Account | null> {
    return this.accounts.get(accountId) || null;
  }

  async createAccount(
    accountId: string,
    initialBalance: number = 0
  ): Promise<Account> {
    const account: Account = {
      id: accountId,
      balance: initialBalance,
    };
    this.accounts.set(accountId, account);
    return account;
  }

  async updateAccountBalance(
    accountId: string,
    newBalance: number
  ): Promise<Account> {
    const account = this.accounts.get(accountId);
    if (!account) {
      throw new Error("Account not found");
    }
    account.balance = newBalance;
    this.accounts.set(accountId, account);
    return account;
  }

  async addTransaction(
    transaction: Omit<Transaction, "id" | "timestamp">
  ): Promise<Transaction> {
    const newTransaction: Transaction = {
      ...transaction,
      id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    };
    this.transactions.push(newTransaction);
    return newTransaction;
  }

  async getTransactions(
    accountId: string,
    limit: number = 10
  ): Promise<Transaction[]> {
    return this.transactions
      .filter(
        (tx) =>
          tx.accountId === accountId || tx.destinationAccountId === accountId
      )
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  async reset(): Promise<void> {
    this.accounts.clear();
    this.transactions = [];
  }
}

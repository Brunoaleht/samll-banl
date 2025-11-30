import { IStorageAdapter } from "@/lib/storage/adapter.interface";
import { getStorage } from "@/lib/storage/storage.factory";
import { Transaction } from "@/types";

export class TransactionRepository {
  private storage: IStorageAdapter;

  constructor() {
    this.storage = getStorage();
  }

  async create(
    transaction: Omit<Transaction, "id" | "timestamp">
  ): Promise<Transaction> {
    return this.storage.addTransaction(transaction);
  }

  async findByAccountId(
    accountId: number,
    limit: number = 10
  ): Promise<Transaction[]> {
    return this.storage.getTransactions(accountId, limit);
  }

  async deleteAll(): Promise<void> {
    await this.storage.reset();
  }
}

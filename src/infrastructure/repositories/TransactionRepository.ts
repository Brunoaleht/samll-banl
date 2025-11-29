import { ITransactionRepository } from "@/domain/repositories/ITransactionRepository";
import { Transaction } from "@/domain/entities/Transaction";
import { IStorageAdapter } from "@/lib/storage/adapter.interface";

export class TransactionRepository implements ITransactionRepository {
  constructor(private storageAdapter: IStorageAdapter) {}

  async save(
    transaction: Omit<Transaction, "id" | "timestamp">
  ): Promise<Transaction> {
    const saved = await this.storageAdapter.addTransaction(transaction);
    return new Transaction(
      saved.id,
      saved.type,
      saved.accountId,
      saved.amount,
      saved.timestamp,
      saved.destinationAccountId
    );
  }

  async findByAccountId(
    accountId: string,
    limit?: number
  ): Promise<Transaction[]> {
    const transactions = await this.storageAdapter.getTransactions(
      accountId,
      limit
    );
    return transactions.map(
      (t) =>
        new Transaction(
          t.id,
          t.type,
          t.accountId,
          t.amount,
          t.timestamp,
          t.destinationAccountId
        )
    );
  }

  async deleteAll(): Promise<void> {
    await this.storageAdapter.reset();
  }
}

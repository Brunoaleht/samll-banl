import { Transaction } from "../entities/Transaction";

export interface ITransactionRepository {
  save(
    transaction: Omit<Transaction, "id" | "timestamp">
  ): Promise<Transaction>;
  findByAccountId(accountId: string, limit?: number): Promise<Transaction[]>;
  deleteAll(): Promise<void>;
}

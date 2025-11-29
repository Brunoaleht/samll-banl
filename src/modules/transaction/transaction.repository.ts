import { Repository } from "typeorm";
import { getDataSource } from "@/lib/database/connection";
import { TransactionEntity, TransactionType } from "./transaction.entity";
import { Transaction } from "@/lib/storage/types";

export class TransactionRepository {
  private repository: Repository<TransactionEntity> | null = null;

  private async getRepository(): Promise<Repository<TransactionEntity>> {
    if (!this.repository) {
      const dataSource = await getDataSource();
      this.repository = dataSource.getRepository(TransactionEntity);
    }
    return this.repository;
  }

  async create(
    transaction: Omit<Transaction, "id" | "timestamp">
  ): Promise<Transaction> {
    const repo = await this.getRepository();
    const id = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const transactionEntity = repo.create({
      id,
      type: transaction.type,
      accountId: transaction.accountId,
      destinationAccountId: transaction.destinationAccountId,
      amount: transaction.amount,
    });

    await repo.save(transactionEntity);

    return {
      id,
      ...transaction,
      timestamp: transactionEntity.timestamp,
    };
  }

  async findByAccountId(
    accountId: string,
    limit: number = 10
  ): Promise<Transaction[]> {
    const repo = await this.getRepository();
    const transactions = await repo.find({
      where: [{ accountId }, { destinationAccountId: accountId }],
      order: { timestamp: "DESC" },
      take: limit,
    });

    return transactions.map((tx) => ({
      id: tx.id,
      type: tx.type,
      accountId: tx.accountId,
      destinationAccountId: tx.destinationAccountId || undefined,
      amount: parseFloat(tx.amount.toString()),
      timestamp: tx.timestamp,
    }));
  }

  async deleteAll(): Promise<void> {
    const repo = await this.getRepository();
    await repo.delete({});
  }
}

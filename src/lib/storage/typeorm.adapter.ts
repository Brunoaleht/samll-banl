import { Repository } from "typeorm";
import { IStorageAdapter } from "./adapter.interface";
import { Account, Transaction } from "../../types";
import { getDataSource } from "@/lib/database/connection";
import { AccountEntity } from "@/lib/modules/account/account.entity";
import { TransactionEntity } from "@/lib/modules/transaction/transaction.entity";

export class TypeOrmAdapter implements IStorageAdapter {
  private accountRepo: Repository<AccountEntity> | null = null;
  private transactionRepo: Repository<TransactionEntity> | null = null;

  private async init() {
    if (this.accountRepo && this.transactionRepo) return;

    const ds = await getDataSource();
    this.accountRepo = ds.getRepository(AccountEntity);
    this.transactionRepo = ds.getRepository(TransactionEntity);
  }

  async getAccount(accountId: number): Promise<Account | null> {
    await this.init();
    const acc = await this.accountRepo!.findOne({ where: { id: accountId } });
    return acc ? { id: acc.id, balance: Number(acc.balance) } : null;
  }

  async createAccount(accountId: number, initialBalance = 0): Promise<Account> {
    await this.init();

    const account = this.accountRepo!.create({
      id: accountId,
      balance: initialBalance,
    });

    await this.accountRepo!.save(account);

    return { id: account.id, balance: Number(account.balance) };
  }

  async updateAccountBalance(accountId: number, newBalance: number) {
    await this.init();
    await this.accountRepo!.update({ id: accountId }, { balance: newBalance });

    const updated = await this.getAccount(accountId);
    if (!updated) throw new Error("Account not found");
    return updated;
  }

  async addTransaction(tx: Omit<Transaction, "id" | "timestamp">) {
    await this.init();

    const id = `txn_${Date.now()}`;
    const entity = this.transactionRepo!.create({
      id,
      ...tx,
    });

    await this.transactionRepo!.save(entity);

    return {
      id: entity.id,
      type: entity.type,
      accountId: entity.accountId,
      destinationAccountId: entity.destinationAccountId || undefined,
      amount: Number(entity.amount),
      timestamp: entity.timestamp,
    };
  }

  async getTransactions(accountId: number, limit = 10) {
    await this.init();

    const txs = await this.transactionRepo!.find({
      where: [{ accountId }, { destinationAccountId: accountId }],
      order: { timestamp: "DESC" },
      take: limit,
    });

    return txs.map((tx) => ({
      id: tx.id,
      type: tx.type,
      accountId: tx.accountId,
      destinationAccountId: tx.destinationAccountId || undefined,
      amount: Number(tx.amount),
      timestamp: tx.timestamp,
    }));
  }

  async reset() {
    await this.init();
    await this.transactionRepo!.clear();
    await this.accountRepo!.clear();
  }
}

import { Repository } from "typeorm";
import { IStorageAdapter } from "./adapter.interface";
import { Account, Transaction } from "../../types";
import { getDataSource } from "@/lib/database/connection";
import { AccountEntity } from "@/modules/account/account.entity";
import { TransactionEntity } from "@/modules/transaction/transaction.entity";

export class TypeOrmAdapter implements IStorageAdapter {
  private accountRepository: Repository<AccountEntity>;
  private transactionRepository: Repository<TransactionEntity>;

  constructor() {
    // Repositories will be initialized when getDataSource is called
    this.accountRepository = null as any;
    this.transactionRepository = null as any;
  }

  private async initializeRepositories(): Promise<void> {
    const dataSource = await getDataSource();
    this.accountRepository = dataSource.getRepository(AccountEntity);
    this.transactionRepository = dataSource.getRepository(TransactionEntity);
  }

  async getAccount(accountId: string): Promise<Account | null> {
    await this.initializeRepositories();
    const account = await this.accountRepository.findOne({
      where: { id: accountId },
    });

    if (!account) {
      return null;
    }

    return {
      id: account.id,
      balance: parseFloat(account.balance.toString()),
    };
  }

  async createAccount(
    accountId: string,
    initialBalance: number = 0
  ): Promise<Account> {
    await this.initializeRepositories();
    const account = this.accountRepository.create({
      id: accountId,
      balance: initialBalance,
    });

    await this.accountRepository.save(account);

    return {
      id: account.id,
      balance: parseFloat(account.balance.toString()),
    };
  }

  async updateAccountBalance(
    accountId: string,
    newBalance: number
  ): Promise<Account> {
    await this.initializeRepositories();
    await this.accountRepository.update(
      { id: accountId },
      { balance: newBalance }
    );

    const account = await this.getAccount(accountId);
    if (!account) {
      throw new Error("Account not found");
    }

    return account;
  }

  async addTransaction(
    transaction: Omit<Transaction, "id" | "timestamp">
  ): Promise<Transaction> {
    await this.initializeRepositories();
    const id = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const transactionEntity = this.transactionRepository.create({
      id,
      type: transaction.type,
      accountId: transaction.accountId,
      destinationAccountId: transaction.destinationAccountId,
      amount: transaction.amount,
    });

    await this.transactionRepository.save(transactionEntity);

    return {
      id,
      ...transaction,
      timestamp: transactionEntity.timestamp,
    };
  }

  async getTransactions(
    accountId: string,
    limit: number = 10
  ): Promise<Transaction[]> {
    await this.initializeRepositories();
    const transactions = await this.transactionRepository.find({
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

  async reset(): Promise<void> {
    await this.initializeRepositories();
    // Delete transactions first due to foreign key constraints
    await this.transactionRepository.delete({});
    await this.accountRepository.delete({});
  }
}

import { Repository } from "typeorm";
import { getDataSource } from "@/lib/database/connection";
import { AccountEntity } from "./account.entity";
import { Account } from "@/lib/storage/types";

export class AccountRepository {
  private repository: Repository<AccountEntity> | null = null;

  private async getRepository(): Promise<Repository<AccountEntity>> {
    if (!this.repository) {
      const dataSource = await getDataSource();
      this.repository = dataSource.getRepository(AccountEntity);
    }
    return this.repository;
  }

  async findById(accountId: string): Promise<Account | null> {
    const repo = await this.getRepository();
    const account = await repo.findOne({ where: { id: accountId } });

    if (!account) {
      return null;
    }

    return {
      id: account.id,
      balance: parseFloat(account.balance.toString()),
    };
  }

  async create(
    accountId: string,
    initialBalance: number = 0
  ): Promise<Account> {
    const repo = await this.getRepository();
    const account = repo.create({
      id: accountId,
      balance: initialBalance,
    });

    await repo.save(account);

    return {
      id: account.id,
      balance: parseFloat(account.balance.toString()),
    };
  }

  async updateBalance(accountId: string, newBalance: number): Promise<Account> {
    const repo = await this.getRepository();
    await repo.update({ id: accountId }, { balance: newBalance });

    const account = await this.findById(accountId);
    if (!account) {
      throw new Error("Account not found");
    }

    return account;
  }

  async exists(accountId: string): Promise<boolean> {
    const repo = await this.getRepository();
    const count = await repo.count({ where: { id: accountId } });
    return count > 0;
  }

  async deleteAll(): Promise<void> {
    const repo = await this.getRepository();
    await repo.delete({});
  }
}

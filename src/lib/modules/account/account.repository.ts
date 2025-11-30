import { Account } from "@/types";
import { IStorageAdapter } from "@/lib/storage/adapter.interface";
import { getStorage } from "@/lib/storage/storage.factory";

export class AccountRepository {
  private storage: IStorageAdapter;

  constructor() {
    this.storage = getStorage();
  }

  async findById(accountId: number): Promise<Account | null> {
    return this.storage.getAccount(accountId);
  }

  async create(
    accountId: number,
    initialBalance: number = 0
  ): Promise<Account> {
    return this.storage.createAccount(accountId, initialBalance);
  }

  async updateBalance(accountId: number, newBalance: number): Promise<Account> {
    return this.storage.updateAccountBalance(accountId, newBalance);
  }

  async exists(accountId: number): Promise<boolean> {
    const acc = await this.storage.getAccount(accountId);
    return !!acc;
  }

  async deleteAll(): Promise<void> {
    await this.storage.reset();
  }
}

import { Account } from "@/types";
import { IStorageAdapter } from "@/lib/storage/adapter.interface";
import { getStorage } from "@/lib/storage/storage.factory";

export class AccountRepository {
  private storage: IStorageAdapter;

  constructor() {
    this.storage = getStorage();
  }

  async findById(accountId: string): Promise<Account | null> {
    return this.storage.getAccount(accountId);
  }

  async create(
    accountId: string,
    initialBalance: number = 0
  ): Promise<Account> {
    return this.storage.createAccount(accountId, initialBalance);
  }

  async updateBalance(accountId: string, newBalance: number): Promise<Account> {
    return this.storage.updateAccountBalance(accountId, newBalance);
  }

  async exists(accountId: string): Promise<boolean> {
    const acc = await this.storage.getAccount(accountId);
    return !!acc;
  }

  async deleteAll(): Promise<void> {
    await this.storage.reset();
  }
}

import { IAccountRepository } from "@/domain/repositories/IAccountRepository";
import { Account } from "@/domain/entities/Account";
import { IStorageAdapter } from "@/lib/storage/adapter.interface";

export class AccountRepository implements IAccountRepository {
  constructor(private storageAdapter: IStorageAdapter) {}

  async findById(id: string): Promise<Account | null> {
    const account = await this.storageAdapter.getAccount(id);
    if (!account) return null;
    return new Account(account.id, account.balance);
  }

  async create(id: string, initialBalance: number): Promise<Account> {
    const account = await this.storageAdapter.createAccount(id, initialBalance);
    return new Account(account.id, account.balance);
  }

  async save(account: Account): Promise<Account> {
    const updated = await this.storageAdapter.updateAccountBalance(
      account.id,
      account.balance
    );
    return new Account(updated.id, updated.balance);
  }

  async delete(id: string): Promise<void> {
    // Implementar se necessário
  }
}

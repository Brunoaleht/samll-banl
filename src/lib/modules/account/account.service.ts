import { AccountRepository } from "./account.repository";
import { Account } from "@/types";

export class AccountService {
  private accountRepository: AccountRepository;

  constructor(accountRepository?: AccountRepository) {
    this.accountRepository = accountRepository || new AccountRepository();
  }

  async getAccount(accountId: string): Promise<Account> {
    const account = await this.accountRepository.findById(accountId);
    if (!account) {
      throw new Error("Account not found");
    }
    return account;
  }

  async getAccountOrCreate(
    accountId: string,
    initialBalance: number = 0
  ): Promise<Account> {
    const account = await this.accountRepository.findById(accountId);
    if (account) {
      return account;
    }
    return await this.accountRepository.create(accountId, initialBalance);
  }

  async createAccount(
    accountId: string,
    initialBalance: number = 0
  ): Promise<Account> {
    const exists = await this.accountRepository.exists(accountId);
    if (exists) {
      return (await this.accountRepository.findById(accountId)) as Account;
    }
    return await this.accountRepository.create(accountId, initialBalance);
  }

  async updateBalance(accountId: string, newBalance: number): Promise<Account> {
    return await this.accountRepository.updateBalance(accountId, newBalance);
  }

  async reset(): Promise<void> {
    await this.accountRepository.deleteAll();
  }
}

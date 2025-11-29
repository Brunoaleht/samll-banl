import { Account } from "../entities/Account";

export interface IAccountRepository {
  findById(id: string): Promise<Account | null>;
  create(id: string, initialBalance: number): Promise<Account>;
  save(account: Account): Promise<Account>;
  delete(id: string): Promise<void>;
}

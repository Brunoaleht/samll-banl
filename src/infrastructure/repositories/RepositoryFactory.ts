import { IAccountRepository } from "@/domain/repositories/IAccountRepository";
import { ITransactionRepository } from "@/domain/repositories/ITransactionRepository";
import { AccountRepository } from "./AccountRepository";
import { TransactionRepository } from "./TransactionRepository";
import { getStorage } from "@/lib/storage/storage.factory";

export class RepositoryFactory {
  private static accountRepository: IAccountRepository;
  private static transactionRepository: ITransactionRepository;

  static getAccountRepository(): IAccountRepository {
    if (!RepositoryFactory.accountRepository) {
      const storage = getStorage();
      RepositoryFactory.accountRepository = new AccountRepository(storage);
    }
    return RepositoryFactory.accountRepository;
  }

  static getTransactionRepository(): ITransactionRepository {
    if (!RepositoryFactory.transactionRepository) {
      const storage = getStorage();
      RepositoryFactory.transactionRepository = new TransactionRepository(
        storage
      );
    }
    return RepositoryFactory.transactionRepository;
  }
}

import { IAccountRepository } from "@/domain/repositories/IAccountRepository";
import { ITransactionRepository } from "@/domain/repositories/ITransactionRepository";

export class ResetUseCase {
  constructor(
    private accountRepository: IAccountRepository,
    private transactionRepository: ITransactionRepository
  ) {}

  async execute(): Promise<void> {
    await this.transactionRepository.deleteAll();
  }
}

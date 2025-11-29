import { IAccountRepository } from "@/domain/repositories/IAccountRepository";
import { ITransactionRepository } from "@/domain/repositories/ITransactionRepository";
import { Account } from "@/domain/entities/Account";
import { InsufficientFundsError, NotFoundError } from "@/shared/errors/AppError";
import { DepositDTO, AccountResponseDTO } from "../dtos";

export class DepositUseCase {
  constructor(
    private accountRepository: IAccountRepository,
    private transactionRepository: ITransactionRepository
  ) {}

  async execute(dto: DepositDTO): Promise<AccountResponseDTO> {
    let account = await this.accountRepository.findById(dto.destination);

    if (!account) {
      account = await this.accountRepository.create(dto.destination, 0);
    }

    account.deposit(dto.amount);
    const updatedAccount = await this.accountRepository.save(account);

    await this.transactionRepository.save({
      type: "deposit",
      accountId: dto.destination,
      amount: dto.amount,
    });

    return new AccountResponseDTO(updatedAccount.id, updatedAccount.balance);
  }
}

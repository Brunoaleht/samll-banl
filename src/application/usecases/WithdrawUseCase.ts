import { IAccountRepository } from "@/domain/repositories/IAccountRepository";
import { ITransactionRepository } from "@/domain/repositories/ITransactionRepository";
import { InsufficientFundsError, NotFoundError } from "@/shared/errors/AppError";
import { WithdrawDTO, AccountResponseDTO } from "../dtos";

export class WithdrawUseCase {
  constructor(
    private accountRepository: IAccountRepository,
    private transactionRepository: ITransactionRepository
  ) {}

  async execute(dto: WithdrawDTO): Promise<AccountResponseDTO> {
    const account = await this.accountRepository.findById(dto.origin);

    if (!account) {
      throw new NotFoundError("Account not found");
    }

    if (account.balance < dto.amount) {
      throw new InsufficientFundsError();
    }

    account.withdraw(dto.amount);
    const updatedAccount = await this.accountRepository.save(account);

    await this.transactionRepository.save({
      type: "withdraw",
      accountId: dto.origin,
      amount: dto.amount,
    });

    return new AccountResponseDTO(updatedAccount.id, updatedAccount.balance);
  }
}

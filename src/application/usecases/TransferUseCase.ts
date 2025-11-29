import { IAccountRepository } from "@/domain/repositories/IAccountRepository";
import { ITransactionRepository } from "@/domain/repositories/ITransactionRepository";
import {
  InsufficientFundsError,
  NotFoundError,
} from "@/shared/errors/AppError";
import { TransferDTO, EventResponseDTO, AccountResponseDTO } from "../dtos";

export class TransferUseCase {
  constructor(
    private accountRepository: IAccountRepository,
    private transactionRepository: ITransactionRepository
  ) {}

  async execute(dto: TransferDTO): Promise<EventResponseDTO> {
    const originAccount = await this.accountRepository.findById(dto.origin);
    if (!originAccount) {
      throw new NotFoundError("Origin account not found");
    }

    if (originAccount.balance < dto.amount) {
      throw new InsufficientFundsError();
    }

    let destinationAccount = await this.accountRepository.findById(
      dto.destination
    );
    if (!destinationAccount) {
      destinationAccount = await this.accountRepository.create(
        dto.destination,
        0
      );
    }

    originAccount.transfer(dto.amount);
    destinationAccount.receive(dto.amount);

    const updatedOriginAccount = await this.accountRepository.save(
      originAccount
    );
    const updatedDestinationAccount = await this.accountRepository.save(
      destinationAccount
    );

    await this.transactionRepository.save({
      type: "transfer",
      accountId: dto.origin,
      destinationAccountId: dto.destination,
      amount: dto.amount,
    });

    return new EventResponseDTO(
      new AccountResponseDTO(
        updatedOriginAccount.id,
        updatedOriginAccount.balance
      ),
      new AccountResponseDTO(
        updatedDestinationAccount.id,
        updatedDestinationAccount.balance
      )
    );
  }
}

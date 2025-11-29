import { IAccountRepository } from "@/domain/repositories/IAccountRepository";
import { NotFoundError } from "@/shared/errors/AppError";
import { GetBalanceDTO, BalanceResponseDTO } from "../dtos";

export class GetBalanceUseCase {
  constructor(private accountRepository: IAccountRepository) {}

  async execute(dto: GetBalanceDTO): Promise<BalanceResponseDTO> {
    const account = await this.accountRepository.findById(dto.accountId);

    if (!account) {
      throw new NotFoundError("Account not found");
    }

    return new BalanceResponseDTO(account.balance);
  }
}

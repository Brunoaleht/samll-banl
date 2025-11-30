import { TransactionRepository } from "./transaction.repository";
import { AccountService } from "@/lib/modules/account/account.service";

export interface DepositRequest {
  destination: string;
  amount: number;
}

export interface WithdrawRequest {
  origin: string;
  amount: number;
}

export interface TransferRequest {
  origin: string;
  destination: string;
  amount: number;
}

export interface DepositResponse {
  destination: {
    id: string;
    balance: number;
  };
}

export interface WithdrawResponse {
  origin: {
    id: string;
    balance: number;
  };
}

export interface TransferResponse {
  origin: {
    id: string;
    balance: number;
  };
  destination: {
    id: string;
    balance: number;
  };
}

export class TransactionService {
  private transactionRepository: TransactionRepository;
  private accountService: AccountService;

  constructor(
    transactionRepository?: TransactionRepository,
    accountService?: AccountService
  ) {
    this.transactionRepository =
      transactionRepository || new TransactionRepository();
    this.accountService = accountService || new AccountService();
  }

  async deposit(request: DepositRequest): Promise<DepositResponse> {
    if (!request.destination) {
      throw new Error("destination is required");
    }

    const account = await this.accountService.getAccountOrCreate(
      request.destination,
      0
    );

    const newBalance = account.balance + request.amount;
    const updatedAccount = await this.accountService.updateBalance(
      request.destination,
      newBalance
    );

    await this.transactionRepository.create({
      type: "deposit",
      accountId: request.destination,
      amount: request.amount,
    });

    return {
      destination: {
        id: updatedAccount.id,
        balance: updatedAccount.balance,
      },
    };
  }

  async withdraw(request: WithdrawRequest): Promise<WithdrawResponse> {
    if (!request.origin) {
      throw new Error("origin is required");
    }

    const account = await this.accountService.getAccount(request.origin);

    if (account.balance < request.amount) {
      throw new Error("Insufficient funds");
    }

    const newBalance = account.balance - request.amount;
    const updatedAccount = await this.accountService.updateBalance(
      request.origin,
      newBalance
    );

    await this.transactionRepository.create({
      type: "withdraw",
      accountId: request.origin,
      amount: request.amount,
    });

    return {
      origin: {
        id: updatedAccount.id,
        balance: updatedAccount.balance,
      },
    };
  }

  async transfer(request: TransferRequest): Promise<TransferResponse> {
    if (!request.origin || !request.destination) {
      throw new Error("origin and destination are required");
    }

    const originAccount = await this.accountService.getAccount(request.origin);

    if (originAccount.balance < request.amount) {
      throw new Error("Insufficient funds");
    }

    const destinationAccount = await this.accountService.getAccountOrCreate(
      request.destination,
      0
    );

    const newOriginBalance = originAccount.balance - request.amount;
    const newDestinationBalance = destinationAccount.balance + request.amount;

    const updatedOriginAccount = await this.accountService.updateBalance(
      request.origin,
      newOriginBalance
    );
    const updatedDestinationAccount = await this.accountService.updateBalance(
      request.destination,
      newDestinationBalance
    );

    await this.transactionRepository.create({
      type: "transfer",
      accountId: request.origin,
      destinationAccountId: request.destination,
      amount: request.amount,
    });

    return {
      origin: {
        id: updatedOriginAccount.id,
        balance: updatedOriginAccount.balance,
      },
      destination: {
        id: updatedDestinationAccount.id,
        balance: updatedDestinationAccount.balance,
      },
    };
  }

  async reset(): Promise<void> {
    await this.transactionRepository.deleteAll();
    await this.accountService.reset();
  }
}

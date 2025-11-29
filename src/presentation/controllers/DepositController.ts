import { NextRequest, NextResponse } from "next/server";
import { DepositUseCase } from "@/application/usecases";
import { DepositDTO } from "@/application/dtos";
import { AppError } from "@/shared/errors/AppError";
import { RepositoryFactory } from "@/infrastructure/repositories/RepositoryFactory";

export class DepositController {
  private useCase: DepositUseCase;

  constructor() {
    const accountRepository = RepositoryFactory.getAccountRepository();
    const transactionRepository = RepositoryFactory.getTransactionRepository();
    this.useCase = new DepositUseCase(accountRepository, transactionRepository);
  }

  async handle(request: NextRequest, body: Record<string, unknown>): Promise<NextResponse> {
    try {
      const { destination, amount } = body;

      if (!destination || amount === undefined) {
        return NextResponse.json(
          { error: "destination and amount are required" },
          { status: 400 }
        );
      }

      if (typeof amount !== "number" || amount <= 0) {
        return NextResponse.json(
          { error: "amount must be a positive number" },
          { status: 400 }
        );
      }

      const dto = new DepositDTO(destination as string, amount as number);
      const result = await this.useCase.execute(dto);

      return NextResponse.json(
        { destination: { id: result.id, balance: result.balance } },
        { status: 201 }
      );
    } catch (error) {
      return this.handleError(error);
    }
  }

  private handleError(error: unknown): NextResponse {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

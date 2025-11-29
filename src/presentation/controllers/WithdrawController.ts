import { NextRequest, NextResponse } from "next/server";
import { WithdrawUseCase } from "@/application/usecases";
import { WithdrawDTO } from "@/application/dtos";
import { AppError } from "@/shared/errors/AppError";
import { RepositoryFactory } from "@/infrastructure/repositories/RepositoryFactory";

export class WithdrawController {
  private useCase: WithdrawUseCase;

  constructor() {
    const accountRepository = RepositoryFactory.getAccountRepository();
    const transactionRepository = RepositoryFactory.getTransactionRepository();
    this.useCase = new WithdrawUseCase(accountRepository, transactionRepository);
  }

  async handle(request: NextRequest, body: Record<string, unknown>): Promise<NextResponse> {
    try {
      const { origin, amount } = body;

      if (!origin || amount === undefined) {
        return NextResponse.json(
          { error: "origin and amount are required" },
          { status: 400 }
        );
      }

      if (typeof amount !== "number" || amount <= 0) {
        return NextResponse.json(
          { error: "amount must be a positive number" },
          { status: 400 }
        );
      }

      const dto = new WithdrawDTO(origin as string, amount as number);
      const result = await this.useCase.execute(dto);

      return NextResponse.json(
        { origin: { id: result.id, balance: result.balance } },
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

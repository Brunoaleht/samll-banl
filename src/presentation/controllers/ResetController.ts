import { NextRequest, NextResponse } from "next/server";
import { ResetUseCase } from "@/application/usecases";
import { AppError } from "@/shared/errors/AppError";
import { RepositoryFactory } from "@/infrastructure/repositories/RepositoryFactory";

export class ResetController {
  private useCase: ResetUseCase;

  constructor() {
    const accountRepository = RepositoryFactory.getAccountRepository();
    const transactionRepository = RepositoryFactory.getTransactionRepository();
    this.useCase = new ResetUseCase(accountRepository, transactionRepository);
  }

  async handle(request: NextRequest): Promise<NextResponse> {
    try {
      await this.useCase.execute();
      return NextResponse.json({}, { status: 200 });
    } catch (error) {
      return this.handleError(error);
    }
  }

  private handleError(error: unknown): NextResponse {
    if (error instanceof AppError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

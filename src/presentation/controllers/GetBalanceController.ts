import { NextRequest, NextResponse } from "next/server";
import { GetBalanceUseCase } from "@/application/usecases";
import { GetBalanceDTO, BalanceResponseDTO } from "@/application/dtos";
import { AppError } from "@/shared/errors/AppError";
import { RepositoryFactory } from "@/infrastructure/repositories/RepositoryFactory";

export class GetBalanceController {
  private useCase: GetBalanceUseCase;

  constructor() {
    const repository = RepositoryFactory.getAccountRepository();
    this.useCase = new GetBalanceUseCase(repository);
  }

  async handle(request: NextRequest): Promise<NextResponse> {
    try {
      const { searchParams } = new URL(request.url);
      const accountId = searchParams.get("account_id");

      if (!accountId) {
        return NextResponse.json(
          { error: "account_id is required" },
          { status: 400 }
        );
      }

      const dto = new GetBalanceDTO(accountId);
      const result = await this.useCase.execute(dto);

      return NextResponse.json(
        { balance: result.balance },
        { status: 200 }
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

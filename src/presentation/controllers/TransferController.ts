import { NextRequest, NextResponse } from "next/server";
import { TransferUseCase } from "@/application/usecases";
import { TransferDTO } from "@/application/dtos";
import { AppError } from "@/shared/errors/AppError";
import { RepositoryFactory } from "@/infrastructure/repositories/RepositoryFactory";

export class TransferController {
  private useCase: TransferUseCase;

  constructor() {
    const accountRepository = RepositoryFactory.getAccountRepository();
    const transactionRepository = RepositoryFactory.getTransactionRepository();
    this.useCase = new TransferUseCase(
      accountRepository,
      transactionRepository
    );
  }

  async handle(
    request: NextRequest,
    body: Record<string, unknown>
  ): Promise<NextResponse> {
    try {
      const { origin, destination, amount } = body;

      if (!origin || !destination || amount === undefined) {
        return NextResponse.json(
          { error: "origin, destination and amount are required" },
          { status: 400 }
        );
      }

      if (typeof amount !== "number" || amount <= 0) {
        return NextResponse.json(
          { error: "amount must be a positive number" },
          { status: 400 }
        );
      }

      const dto = new TransferDTO(
        origin as string,
        destination as string,
        amount as number
      );
      const result = await this.useCase.execute(dto);

      return NextResponse.json(
        {
          origin: result.origin
            ? { id: result.origin.id, balance: result.origin.balance }
            : undefined,
          destination: result.destination
            ? { id: result.destination.id, balance: result.destination.balance }
            : undefined,
        },
        { status: 201 }
      );
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

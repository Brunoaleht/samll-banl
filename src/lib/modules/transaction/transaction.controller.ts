import { NextRequest, NextResponse } from "next/server";
import { TransactionService } from "./transaction.service";

export class TransactionController {
  private transactionService: TransactionService;

  constructor() {
    this.transactionService = new TransactionService();
  }

  async handleEvent(request: NextRequest): Promise<NextResponse> {
    try {
      const body = await request.json();
      let { type, origin, destination, amount } = body;

      if (!type || !amount) {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
      }

      // Converter origin e destination para number se fornecidos
      if (origin !== undefined && origin !== null) {
        origin = typeof origin === "number" ? origin : parseInt(origin, 10);
        if (isNaN(origin)) {
          return NextResponse.json(
            { error: "origin must be a valid number" },
            { status: 400 }
          );
        }
      }

      if (destination !== undefined && destination !== null) {
        destination =
          typeof destination === "number"
            ? destination
            : parseInt(destination, 10);
        if (isNaN(destination)) {
          return NextResponse.json(
            { error: "destination must be a valid number" },
            { status: 400 }
          );
        }
      }

      if (type === "deposit") {
        const result = await this.transactionService.deposit({
          destination,
          amount,
        });
        return NextResponse.json(result, { status: 201 });
      }

      if (type === "withdraw") {
        const result = await this.transactionService.withdraw({
          origin,
          amount,
        });
        return NextResponse.json(result, { status: 201 });
      }

      if (type === "transfer") {
        const result = await this.transactionService.transfer({
          origin,
          destination,
          amount,
        });
        return NextResponse.json(result, { status: 201 });
      }

      return NextResponse.json(
        { error: "Invalid event type" },
        { status: 400 }
      );
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Account not found") {
          return NextResponse.json(
            { error: "Account not found" },
            { status: 404 }
          );
        }
        if (error.message === "Insufficient funds") {
          return NextResponse.json(
            { error: "Insufficient funds" },
            { status: 400 }
          );
        }
        if (
          error.message === "destination is required" ||
          error.message === "origin is required" ||
          error.message === "origin and destination are required"
        ) {
          return NextResponse.json({ error: error.message }, { status: 400 });
        }
      }
      console.error("Event error:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }

  async reset(): Promise<NextResponse> {
    try {
      await this.transactionService.reset();
      return NextResponse.json({}, { status: 200 });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }
}

import { NextRequest, NextResponse } from "next/server";
import {
  authenticateRequest,
  createUnauthorizedResponse,
} from "@/lib/auth/middleware";
import {
  DepositController,
  WithdrawController,
  TransferController,
} from "@/presentation/controllers";

const depositController = new DepositController();
const withdrawController = new WithdrawController();
const transferController = new TransferController();

export async function POST(request: NextRequest): Promise<NextResponse> {
  const auth = authenticateRequest(request);
  if (!auth.success) {
    return createUnauthorizedResponse();
  }

  try {
    const body = await request.json();
    const { type } = body;

    if (!type) {
      return NextResponse.json(
        { error: "type is required" },
        { status: 400 }
      );
    }

    switch (type) {
      case "deposit":
        return await depositController.handle(request, body);
      case "withdraw":
        return await withdrawController.handle(request, body);
      case "transfer":
        return await transferController.handle(request, body);
      default:
        return NextResponse.json(
          { error: "Invalid event type" },
          { status: 400 }
        );
    }
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    console.error("Event error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

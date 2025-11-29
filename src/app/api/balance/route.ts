import { NextRequest, NextResponse } from "next/server";
import {
  authenticateRequest,
  createUnauthorizedResponse,
} from "@/lib/auth/middleware";
import { GetBalanceController } from "@/presentation/controllers";

const getBalanceController = new GetBalanceController();

export async function GET(request: NextRequest): Promise<NextResponse> {
  const auth = authenticateRequest(request);
  if (!auth.success) {
    return createUnauthorizedResponse();
  }

  return await getBalanceController.handle(request);
}

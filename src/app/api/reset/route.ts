import { NextRequest, NextResponse } from "next/server";
import {
  authenticateRequest,
  createUnauthorizedResponse,
} from "@/lib/auth/middleware";
import { ResetController } from "@/presentation/controllers";

const resetController = new ResetController();

export async function POST(request: NextRequest): Promise<NextResponse> {
  const auth = authenticateRequest(request);
  if (!auth.success) {
    return createUnauthorizedResponse();
  }

  return await resetController.handle(request);
}

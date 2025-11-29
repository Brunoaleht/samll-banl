import { NextRequest, NextResponse } from "next/server";
import {
  authenticateRequest,
  createUnauthorizedResponse,
} from "@/modules/auth/auth.middleware";
import { AccountController } from "@/modules/account/account.controller";

const accountController = new AccountController();

export async function GET(request: NextRequest) {
  const auth = authenticateRequest(request);
  if (!auth.success) {
    return createUnauthorizedResponse();
  }

  return accountController.getBalance(request);
}

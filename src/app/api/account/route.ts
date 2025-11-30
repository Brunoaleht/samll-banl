import { AccountController } from "@/lib/modules/account/account.controller";
import {
  authenticateRequest,
  createUnauthorizedResponse,
} from "@/lib/modules/auth/auth.middleware";
import { NextRequest } from "next/server";

const accountController = new AccountController();

export async function GET(request: NextRequest) {
  const auth = authenticateRequest(request);
  if (!auth.success) {
    return createUnauthorizedResponse();
  }

  return accountController.getAccount(request);
}

export async function POST(request: NextRequest) {
  const auth = authenticateRequest(request);
  if (!auth.success) {
    return createUnauthorizedResponse();
  }

  return accountController.createAccount(request);
}

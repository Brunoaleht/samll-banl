import { NextRequest } from "next/server";
import {
  authenticateRequest,
  createUnauthorizedResponse,
} from "@/modules/auth/auth.middleware";
import { TransactionController } from "@/modules/transaction/transaction.controller";

const transactionController = new TransactionController();

export async function POST(request: NextRequest) {
  const auth = authenticateRequest(request);
  if (!auth.success) {
    return createUnauthorizedResponse();
  }

  return transactionController.handleEvent(request);
}

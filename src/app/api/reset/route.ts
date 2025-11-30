import {
  authenticateRequest,
  createUnauthorizedResponse,
} from "@/lib/modules/auth/auth.middleware";
import { TransactionController } from "@/lib/modules/transaction/transaction.controller";
import { NextRequest } from "next/server";

const transactionController = new TransactionController();

export async function POST(request: NextRequest) {
  const auth = authenticateRequest(request);
  if (!auth.success) {
    return createUnauthorizedResponse();
  }

  return transactionController.reset();
}

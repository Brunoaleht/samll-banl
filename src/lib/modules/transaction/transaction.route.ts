import { NextRequest } from "next/server";
import { TransactionController } from "./transaction.controller";

const transactionController = new TransactionController();

export async function POST(request: NextRequest) {
  return transactionController.handleEvent(request);
}

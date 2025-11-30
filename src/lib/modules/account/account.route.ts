import { NextRequest } from "next/server";
import { AccountController } from "./account.controller";

const accountController = new AccountController();

export async function GET(request: NextRequest) {
  return accountController.getBalance(request);
}

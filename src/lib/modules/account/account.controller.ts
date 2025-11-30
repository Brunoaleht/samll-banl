import { NextRequest, NextResponse } from "next/server";
import { AccountService } from "./account.service";

export class AccountController {
  private accountService: AccountService;

  constructor() {
    this.accountService = new AccountService();
  }

  async getBalance(request: NextRequest): Promise<NextResponse> {
    try {
      const { searchParams } = new URL(request.url);
      const accountId = searchParams.get("account_id");

      if (!accountId) {
        return NextResponse.json(
          { error: "account_id is required" },
          { status: 400 }
        );
      }

      const account = await this.accountService.getAccount(accountId);

      return NextResponse.json({ balance: account.balance }, { status: 200 });
    } catch (error) {
      if (error instanceof Error && error.message === "Account not found") {
        return NextResponse.json(
          { error: "Account not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }
}

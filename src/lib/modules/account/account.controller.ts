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
      const accountIdParam = searchParams.get("account_id");

      if (!accountIdParam) {
        return NextResponse.json(
          { error: "account_id is required" },
          { status: 400 }
        );
      }

      const accountId = parseInt(accountIdParam, 10);
      if (isNaN(accountId)) {
        return NextResponse.json(
          { error: "account_id must be a valid number" },
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

  async getAccount(request: NextRequest): Promise<NextResponse> {
    try {
      const { searchParams } = new URL(request.url);
      const accountIdParam = searchParams.get("account_id");

      if (!accountIdParam) {
        return NextResponse.json(
          { error: "account_id is required" },
          { status: 400 }
        );
      }

      const accountId = parseInt(accountIdParam, 10);
      if (isNaN(accountId)) {
        return NextResponse.json(
          { error: "account_id must be a valid number" },
          { status: 400 }
        );
      }

      const account = await this.accountService.getAccount(accountId);

      return NextResponse.json(
        {
          id: account.id,
          balance: account.balance,
        },
        { status: 200 }
      );
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

  async createAccount(request: NextRequest): Promise<NextResponse> {
    try {
      const body = await request.json();
      const { account_id, balance } = body;

      if (!account_id) {
        return NextResponse.json(
          { error: "account_id is required" },
          { status: 400 }
        );
      }

      const accountId =
        typeof account_id === "number" ? account_id : parseInt(account_id, 10);
      if (isNaN(accountId)) {
        return NextResponse.json(
          { error: "account_id must be a valid number" },
          { status: 400 }
        );
      }

      const initialBalance = balance || 0;

      const newAccount = await this.accountService.createAccount(
        accountId,
        initialBalance
      );

      return NextResponse.json(
        {
          id: newAccount.id,
          balance: newAccount.balance,
        },
        { status: 201 }
      );
    } catch (error) {
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }
}

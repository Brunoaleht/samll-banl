import { NextRequest, NextResponse } from "next/server";
import {
  authenticateRequest,
  createUnauthorizedResponse,
} from "@/lib/auth/middleware";
import { getStorage } from "@/lib/storage/storage.factory";

export async function POST(request: NextRequest) {
  const auth = authenticateRequest(request);
  if (!auth.success) {
    return createUnauthorizedResponse();
  }

  try {
    const body = await request.json();
    const { type, origin, destination, amount } = body;

    if (!type || !amount) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const storage = getStorage();

    if (type === "deposit") {
      if (!destination) {
        return NextResponse.json(
          { error: "destination is required" },
          { status: 400 }
        );
      }

      let account = await storage.getAccount(destination);
      if (!account) {
        account = await storage.createAccount(destination, 0);
      }

      const newBalance = account.balance + amount;
      const updatedAccount = await storage.updateAccountBalance(
        destination,
        newBalance
      );

      await storage.addTransaction({
        type: "deposit",
        accountId: destination,
        amount,
      });

      return NextResponse.json(
        {
          destination: {
            id: updatedAccount.id,
            balance: updatedAccount.balance,
          },
        },
        { status: 201 }
      );
    }

    if (type === "withdraw") {
      if (!origin) {
        return NextResponse.json(
          { error: "origin is required" },
          { status: 400 }
        );
      }

      const account = await storage.getAccount(origin);
      if (!account) {
        return NextResponse.json(
          { error: "Account not found" },
          { status: 404 }
        );
      }

      if (account.balance < amount) {
        return NextResponse.json(
          { error: "Insufficient funds" },
          { status: 400 }
        );
      }

      const newBalance = account.balance - amount;
      const updatedAccount = await storage.updateAccountBalance(
        origin,
        newBalance
      );

      await storage.addTransaction({
        type: "withdraw",
        accountId: origin,
        amount,
      });

      return NextResponse.json(
        { origin: { id: updatedAccount.id, balance: updatedAccount.balance } },
        { status: 201 }
      );
    }

    if (type === "transfer") {
      if (!origin || !destination) {
        return NextResponse.json(
          { error: "origin and destination are required" },
          { status: 400 }
        );
      }

      const originAccount = await storage.getAccount(origin);
      if (!originAccount) {
        return NextResponse.json(
          { error: "Account not found" },
          { status: 404 }
        );
      }

      if (originAccount.balance < amount) {
        return NextResponse.json(
          { error: "Insufficient funds" },
          { status: 400 }
        );
      }

      let destinationAccount = await storage.getAccount(destination);
      if (!destinationAccount) {
        destinationAccount = await storage.createAccount(destination, 0);
      }

      const newOriginBalance = originAccount.balance - amount;
      const newDestinationBalance = destinationAccount.balance + amount;

      const updatedOriginAccount = await storage.updateAccountBalance(
        origin,
        newOriginBalance
      );
      const updatedDestinationAccount = await storage.updateAccountBalance(
        destination,
        newDestinationBalance
      );

      await storage.addTransaction({
        type: "transfer",
        accountId: origin,
        destinationAccountId: destination,
        amount,
      });

      return NextResponse.json(
        {
          origin: {
            id: updatedOriginAccount.id,
            balance: updatedOriginAccount.balance,
          },
          destination: {
            id: updatedDestinationAccount.id,
            balance: updatedDestinationAccount.balance,
          },
        },
        { status: 201 }
      );
    }

    return NextResponse.json({ error: "Invalid event type" }, { status: 400 });
  } catch (error) {
    console.error("Event error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

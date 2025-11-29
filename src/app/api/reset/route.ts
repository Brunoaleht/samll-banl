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
    const storage = getStorage();
    await storage.reset();
    return NextResponse.json({}, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./jwt";

export function authenticateRequest(request: NextRequest): {
  success: boolean;
  error?: string;
} {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { success: false, error: "Unauthorized" };
  }

  const token = authHeader.substring(7);
  const payload = verifyToken(token);

  if (!payload) {
    return { success: false, error: "Unauthorized" };
  }

  return { success: true };
}

export function createUnauthorizedResponse(): NextResponse {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

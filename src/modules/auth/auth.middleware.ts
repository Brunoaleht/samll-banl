import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt/jwt";

export interface AuthResult {
  success: boolean;
  error?: string;
  username?: string;
}

export function authenticateRequest(request: NextRequest): AuthResult {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { success: false, error: "Unauthorized" };
  }

  const token = authHeader.substring(7);
  const payload = verifyToken(token);

  if (!payload) {
    return { success: false, error: "Unauthorized" };
  }

  return { success: true, username: payload.username };
}

export function createUnauthorizedResponse(): NextResponse {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

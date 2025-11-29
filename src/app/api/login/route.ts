import { NextRequest, NextResponse } from "next/server";
import { generateToken } from "@/lib/auth/jwt";

const VALID_USERNAME = "admin";
const VALID_PASSWORD = "admin";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, pass } = body;

    if (username === VALID_USERNAME && pass === VALID_PASSWORD) {
      const token = generateToken(username);
      return NextResponse.json({ token }, { status: 200 });
    }

    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { LoginController } from "@/presentation/controllers";

const loginController = new LoginController();

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    return await loginController.handle(request, body);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

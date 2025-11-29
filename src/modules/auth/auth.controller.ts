import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "./auth.service";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async login(request: NextRequest): Promise<NextResponse> {
    try {
      const body = await request.json();
      const { username, pass } = body;

      if (!username || !pass) {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
      }

      const result = await this.authService.login({ username, pass });
      return NextResponse.json(result, { status: 200 });
    } catch (error) {
      if (error instanceof Error && error.message === "Invalid credentials") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
  }
}

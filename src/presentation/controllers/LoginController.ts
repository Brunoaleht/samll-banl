import { NextRequest, NextResponse } from "next/server";
import { LoginUseCase } from "@/application/usecases";
import { LoginDTO } from "@/application/dtos";
import { AppError } from "@/shared/errors/AppError";

export class LoginController {
  private useCase: LoginUseCase;

  constructor() {
    this.useCase = new LoginUseCase();
  }

  async handle(request: NextRequest, body: Record<string, unknown>): Promise<NextResponse> {
    try {
      const { username, pass } = body;

      if (!username || !pass) {
        return NextResponse.json(
          { error: "username and pass are required" },
          { status: 400 }
        );
      }

      const dto = new LoginDTO(username as string, pass as string);
      const result = await this.useCase.execute(dto);

      return NextResponse.json({ token: result.token }, { status: 200 });
    } catch (error) {
      return this.handleError(error);
    }
  }

  private handleError(error: unknown): NextResponse {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

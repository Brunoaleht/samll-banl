import { LoginDTO, LoginResponseDTO } from "../dtos";
import { generateToken } from "@/lib/auth/jwt";
import { ForbiddenError } from "@/shared/errors/AppError";

const VALID_USERNAME = "admin";
const VALID_PASSWORD = "admin";

export class LoginUseCase {
  async execute(dto: LoginDTO): Promise<LoginResponseDTO> {
    if (dto.username !== VALID_USERNAME || dto.password !== VALID_PASSWORD) {
      throw new ForbiddenError("Invalid credentials");
    }

    const token = generateToken(dto.username);
    return new LoginResponseDTO(token);
  }
}

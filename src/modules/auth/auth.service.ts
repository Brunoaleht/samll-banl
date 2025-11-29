import { generateToken } from "@/lib/jwt/jwt";

const VALID_USERNAME = process.env.VALID_USERNAME || "admin";
const VALID_PASSWORD = process.env.VALID_PASSWORD || "admin";

export interface LoginCredentials {
  username: string;
  pass: string;
}

export interface LoginResult {
  token: string;
}

export class AuthService {
  async login(credentials: LoginCredentials): Promise<LoginResult> {
    if (
      credentials.username === VALID_USERNAME &&
      credentials.pass === VALID_PASSWORD
    ) {
      const token = generateToken(credentials.username);
      return { token };
    }

    throw new Error("Invalid credentials");
  }

  validateCredentials(username: string, password: string): boolean {
    return username === VALID_USERNAME && password === VALID_PASSWORD;
  }
}

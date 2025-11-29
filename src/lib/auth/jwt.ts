import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "default-secret-key-change-in-production";

export interface JWTPayload {
  username: string;
}

export function generateToken(username: string): string {
  return jwt.sign({ username }, JWT_SECRET, { expiresIn: "24h" });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

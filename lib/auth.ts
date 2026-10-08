import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "@/types";

const JWT_SECRET = process.env.JWT_SECRET || "vybe_super_secure_jwt_secret_dev_2026_key";

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(user: User): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
      displayName: user.displayName,
      isCreator: user.isCreator,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export function verifyToken(token: string): { id: string; email: string; username: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string; email: string; username: string };
  } catch {
    return null;
  }
}

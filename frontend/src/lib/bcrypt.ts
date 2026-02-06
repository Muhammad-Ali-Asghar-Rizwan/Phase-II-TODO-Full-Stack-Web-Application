import { hash, compare } from 'bcryptjs';

const SALT_ROUNDS = 10;
const MAX_PASSWORD_LENGTH = 72;

export async function hashPassword(password: string): Promise<string> {
  // Check password length
  const byteLength = Buffer.byteLength(password, 'utf8');
  if (byteLength > MAX_PASSWORD_LENGTH) {
    throw new Error(`Password exceeds maximum length of ${MAX_PASSWORD_LENGTH} bytes`);
  }

  return await hash(password, SALT_ROUNDS);
}

export async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return await compare(plainPassword, hashedPassword);
}

export function validateEmail(email: string): boolean {
  const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return pattern.test(email);
}
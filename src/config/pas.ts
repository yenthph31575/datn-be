import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

/**
 * Hash password trước khi lưu vào DB.
 * @param password - mật khẩu plaintext
 * @returns Promise<string> - mật khẩu đã hash
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * So sánh password người nhập với password đã hash trong DB.
 * @param password - mật khẩu plaintext người nhập
 * @param hashed - mật khẩu đã hash từ DB
 * @returns Promise<boolean> - true nếu khớp, false nếu không
 */
export async function comparePassword(password: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(password, hashed);
}

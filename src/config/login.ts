import bcrypt from "bcrypt";

/**
 * Số vòng salt để hash password
 * - Nên >= 10
 * - Có thể cấu hình bằng biến môi trường
 */
const SALT_ROUNDS = Math.max(
  Number(process.env.BCRYPT_SALT_ROUNDS ?? 10),
  10
);

/**
 * Hash password trước khi lưu vào Database
 */
export async function hashPassword(password: string): Promise<string> {
  if (typeof password !== "string" || !password.trim()) {
    throw new Error("Password không hợp lệ");
  }

  if (password.length < 6) {
    throw new Error("Password phải có ít nhất 6 ký tự");
  }

  try {
    return await bcrypt.hash(password, SALT_ROUNDS);
  } catch (error) {
    console.error("❌ Hash password error:", error);
    throw new Error("Không thể mã hóa mật khẩu");
  }
}

/**
 * So sánh password người dùng nhập với password đã hash
 */
export async function comparePassword(
  password: string,
  hashed: string
): Promise<boolean> {
  if (
    typeof password !== "string" ||
    typeof hashed !== "string" ||
    !password ||
    !hashed
  ) {
    return false;
  }

  try {
    return await bcrypt.compare(password, hashed);
  } catch (error) {
    console.error("❌ Compare password error:", error);
    return false;
  }
}

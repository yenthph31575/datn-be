import bcrypt from "bcrypt";

/**
 * Số vòng salt để hash password
 * - Lấy từ env: BCRYPT_SALT_ROUNDS
 * - Tối thiểu: 10 (an toàn)
 */
const SALT_ROUNDS = (() => {
  const rounds = Number(process.env.BCRYPT_SALT_ROUNDS);
  return Number.isInteger(rounds) && rounds >= 10 ? rounds : 10;
})();

/**
 * Hash password trước khi lưu vào Database
 */
export async function hashPassword(password: string): Promise<string> {
  if (typeof password !== "string") {
    throw new Error("Password phải là chuỗi");
  }

  const trimmed = password.trim();

  if (!trimmed) {
    throw new Error("Password không được để trống");
  }

  if (trimmed.length < 6) {
    throw new Error("Password phải có ít nhất 6 ký tự");
  }

  try {
    return await bcrypt.hash(trimmed, SALT_ROUNDS);
  } catch {
    throw new Error("Không thể mã hóa mật khẩu");
  }
}

/**
 * So sánh password người dùng nhập với password đã hash trong DB
 */
export async function comparePassword(
  password: string,
  hashed: string
): Promise<boolean> {
  if (
    typeof password !== "string" ||
    typeof hashed !== "string" ||
    !password.trim()
  ) {
    return false;
  }

  try {
    return await bcrypt.compare(password, hashed);
  } catch {
    return false;
  }
}

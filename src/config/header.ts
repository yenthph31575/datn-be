import bcrypt from "bcrypt";

/**
 * =========================
 * CONFIG
 * =========================
 */

/**
 * Số vòng salt để hash password
 * - Lấy từ ENV nếu hợp lệ
 * - Tối thiểu 10
 * - Mặc định: 10
 */
const SALT_ROUNDS = (() => {
  const rounds = Number(process.env.BCRYPT_SALT_ROUNDS);
  return Number.isInteger(rounds) && rounds >= 10 ? rounds : 10;
})();

/**
 * =========================
 * UTILS
 * =========================
 */

/**
 * Chuẩn hóa password input
 */
function normalizePassword(password: unknown): string | null {
  if (typeof password !== "string") return null;

  const trimmed = password.trim();
  if (!trimmed) return null;
  if (trimmed.length < 6 || trimmed.length > 128) return null;

  return trimmed;
}

/**
 * =========================
 * HASH PASSWORD
 * =========================
 */

export async function hashPassword(password: unknown): Promise<string> {
  const validPassword = normalizePassword(password);

  if (!validPassword) {
    throw new Error("Password không hợp lệ");
  }

  try {
    return await bcrypt.hash(validPassword, SALT_ROUNDS);
  } catch (err) {
    console.error("Hash password error:", err);
    throw new Error("Không thể mã hóa mật khẩu");
  }
}

/**
 * =========================
 * COMPARE PASSWORD
 * =========================
 */

export async function comparePassword(
  password: unknown,
  hashed: unknown
): Promise<boolean> {
  if (typeof hashed !== "string" || !hashed) {
    return false;
  }

  const validPassword = normalizePassword(password);
  if (!validPassword) {
    return false;
  }

  try {
    return await bcrypt.compare(validPassword, hashed);
  } catch (err) {
    console.error("Compare password error:", err);
    return false;
  }
}

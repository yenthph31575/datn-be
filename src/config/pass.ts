import bcrypt from "bcrypt";

/* =========================
 * CONFIG
 * ========================= */

/**
 * Số vòng salt để hash password
 * - Lấy từ ENV nếu hợp lệ
 * - Tối thiểu: 10
 * - Mặc định: 10
 */
const SALT_ROUNDS: number = (() => {
  const rounds = Number(process.env.BCRYPT_SALT_ROUNDS);
  return Number.isInteger(rounds) && rounds >= 10 ? rounds : 10;
})();

/* =========================
 * HELPERS
 * ========================= */

/**
 * Chuẩn hóa & validate password input
 */
function normalizePassword(password: unknown): string | null {
  if (typeof password !== "string") return null;

  const trimmed = password.trim();

  if (!trimmed) return null;
  if (trimmed.length < 6) return null;
  if (trimmed.length > 128) return null;

  return trimmed;
}

/* =========================
 * HASH PASSWORD
 * ========================= */

export async function hashPassword(password: unknown): Promise<string> {
  const validPassword = normalizePassword(password);

  if (!validPassword) {
    throw new Error("Password không hợp lệ");
  }

  try {
    return bcrypt.hash(validPassword, SALT_ROUNDS);
  } catch (error) {
    console.error("[bcrypt] hash error:", error);
    throw new Error("Không thể mã hóa mật khẩu");
  }
}

/* =========================
 * COMPARE PASSWORD
 * ========================= */

export async function comparePassword(
  password: unknown,
  hashed: unknown
): Promise<boolean> {
  if (typeof hashed !== "string" || hashed.length === 0) {
    return false;
  }

  const validPassword = normalizePassword(password);
  if (!validPassword) {
    return false;
  }

  try {
    return bcrypt.compare(validPassword, hashed);
  } catch (error) {
    console.error("[bcrypt] compare error:", error);
    return false;
  }
}

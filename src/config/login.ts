import bcrypt from "bcrypt";

/* =========================
 * CONFIG
 * ========================= */

/**
 * Salt rounds để hash password
 * - Ưu tiên ENV
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
 * Validate password khi HASH (nghiêm ngặt)
 */
function validatePasswordForHash(password: unknown): string {
  if (typeof password !== "string") {
    throw new Error("Password phải là chuỗi");
  }

  const value = password.trim();

  if (!value) {
    throw new Error("Password không được để trống");
  }

  if (value.length < 6 || value.length > 128) {
    throw new Error("Password phải từ 6 đến 128 ký tự");
  }

  return value;
}

/**
 * Normalize password khi COMPARE (nhẹ)
 */
function normalizePassword(password: unknown): string | null {
  if (typeof password !== "string") return null;

  const value = password.trim();
  if (!value) return null;

  return value;
}

/* =========================
 * HASH PASSWORD
 * ========================= */

export async function hashPassword(password: unknown): Promise<string> {
  const validPassword = validatePasswordForHash(password);

  try {
    return await bcrypt.hash(validPassword, SALT_ROUNDS);
  } catch (error) {
    console.error("[bcrypt] hash error:", error);
    throw new Error("Không thể hash password");
  }
}

/* =========================
 * COMPARE PASSWORD
 * ========================= */

export async function comparePassword(
  password: unknown,
  hashed: unknown
): Promise<boolean> {
  if (typeof hashed !== "string" || !hashed) {
    return false;
  }

  const normalized = normalizePassword(password);
  if (!normalized) {
    return false;
  }

  try {
    return await bcrypt.compare(normalized, hashed);
  } catch (error) {
    console.error("[bcrypt] compare error:", error);
    return false;
  }
}

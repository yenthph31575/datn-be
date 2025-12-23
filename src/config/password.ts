import bcrypt from "bcrypt";

/**
 * Số vòng salt để hash password
 * 👉 Có thể đưa vào biến môi trường nếu cần scale
 */
const SALT_ROUNDS: number = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;

/**
 * Hash password trước khi lưu vào Database
 *
 * @param password - mật khẩu người dùng nhập (plaintext)
 * @returns Promise<string> - mật khẩu đã được hash
 *
 * @throws Error nếu password rỗng hoặc hash thất bại
 */
export async function hashPassword(password: string): Promise<string> {
  // Validate đầu vào
  if (!password || password.trim().length === 0) {
    throw new Error("Password không được để trống");
  }

  if (password.length < 6) {
    throw new Error("Password phải có ít nhất 6 ký tự");
  }

  try {
    // Hash password với salt
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    return hashedPassword;
  } catch (error) {
    console.error("❌ Lỗi khi hash password:", error);
    throw new Error("Không thể hash password");
  }
}

/**
 * So sánh password người dùng nhập với password đã hash trong DB
 *
 * @param password - mật khẩu người dùng nhập (plaintext)
 * @param hashed - mật khẩu đã hash lưu trong DB
 * @returns Promise<boolean>
 *          - true: password đúng
 *          - false: password sai hoặc có lỗi
 */
export async function comparePassword(
  password: string,
  hashed: string
): Promise<boolean> {
  // Validate đầu vào
  if (!password || !hashed) {
    return false;
  }

  try {
    const isMatch = await bcrypt.compare(password, hashed);
    return isMatch;
  } catch (error) {
    console.error("❌ Lỗi khi compare password:", error);
    return false;
  }
}

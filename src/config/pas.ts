import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

/** Hash password trước khi lưu DB */
export const hashPassword = async (password: string): Promise<string> => {
  try {
    return await bcrypt.hash(password, SALT_ROUNDS);
  } catch (error) {
    console.error("Error hashing password:", error);
    throw new Error("Could not hash password");
  }
};

/** So sánh password người nhập với password trong DB */
export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    console.error("Error comparing password:", error);
    throw new Error("Could not compare password");
  }
};

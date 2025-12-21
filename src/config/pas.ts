import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

const PasswordUtil = {
  /** Hash password trước khi lưu DB */
  hash: async (password: string): Promise<string> => {
    try {
      return await bcrypt.hash(password, SALT_ROUNDS);
    } catch {
      throw new Error("Could not hash password");
    }
  },

  /** So sánh password người nhập với password trong DB */
  compare: async (password: string, hashed: string): Promise<boolean> => {
    try {
      return await bcrypt.compare(password, hashed);
    } catch {
      throw new Error("Could not compare password");
    }
  },
};

export default PasswordUtil;

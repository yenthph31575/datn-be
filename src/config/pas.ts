import * as bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

/** Hash password trước khi lưu DB */
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

/** So sánh password người nhập với password trong DB */
export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

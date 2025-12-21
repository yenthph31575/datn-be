import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

/** Hash password trước khi lưu DB */
export const hashPassword = (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

/** So sánh password người nhập với password trong DB */
export const comparePassword = (password: string, hashed: string): Promise<boolean> => {
  return bcrypt.compare(password, hashed);
};

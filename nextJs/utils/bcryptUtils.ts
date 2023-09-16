import bcrypt from 'bcrypt';

export const verifyPassword = async (
  password: string,
  hashedPassword: string
) => {
  if (!password || !hashedPassword) return;

  const passwordMatch = await bcrypt.compare(password, hashedPassword);

  if (!passwordMatch) {
    return false; // Incorrect password
  }

  return true;
};

export const hashPassword = async (password: string) => {
  return bcrypt.hashSync(password, 10);
};

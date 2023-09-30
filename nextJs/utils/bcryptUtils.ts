import bcrypt from 'bcryptjs';

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

export const generateSalt = async () => {
  try {
    const saltRounds = 10; // Adjust the number of rounds as needed
    const salt = await bcrypt.genSalt(saltRounds);
    return salt;
  } catch (err) {
    console.error('Error generating salt:', err);
    throw err;
  }
};

const bcrypt = require("bcrypt");

export const verifyPassword = async (password, hashedPassword) => {
  const passwordMatch = await bcrypt.compare(password, hashedPassword);

  if (!passwordMatch) {
    return false; // Incorrect password
  }

  return true;
};

export const hashPassword = async (password) => {
  return bcrypt.hashSync(password, 10);
};

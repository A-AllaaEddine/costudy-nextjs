import jwt from 'jsonwebtoken';

type Payload = {
  id: string;
  email?: string;
  exp: number;
};

export const generateToken = (payload: Payload): string => {
  return jwt.sign(payload, process.env.JWT_SECRET_PHRASE || 'string');
};

export const verifyToken = (token: string) => {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_PHRASE || 'string'
    ) as Payload;

    return decoded;
  } catch (error: any) {
    // console.log(error);
    throw new Error(error.message);
  }
};

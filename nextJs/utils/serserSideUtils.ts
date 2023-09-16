import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from './jwtUtils';
import { getServerSession } from 'next-auth';
import { authOptions } from '../pages/api/auth/[...nextauth]';

export const checkServerSession = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const session = await getServerSession(req, res, authOptions);
  // redirect to signin if there is no session.

  return session?.user;
};

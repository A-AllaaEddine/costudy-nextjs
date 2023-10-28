import { getServerSession } from 'next-auth';
import { authOptions } from '../app/api/auth/[...nextauth]/route';

import { redirect } from 'next/navigation';

export const getSession = async () => {
  return await getServerSession(authOptions);
};
export const checkServerSession = async ({
  isLoggedIn = false,
  skipLogin = false,
  isAdmin = false,
}: {
  isLoggedIn?: boolean;
  skipLogin?: boolean;
  isAdmin?: boolean;
}) => {
  const session = await getServerSession(authOptions);

  if (isLoggedIn && session?.user) {
    return redirect('/');
  }

  if (!session?.user && isLoggedIn) {
    return redirect('/login');
  }
};

export const isLoggedIn = async ({ login = false }: { login?: boolean }) => {
  const session = await getServerSession(authOptions);

  if (session?.user && login) {
    return redirect('/');
  }

  if (!session?.user && !login) {
    return redirect('/login');
  }
};

export const isAdmin = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return redirect('/login');
  }

  if (session?.user && session?.user?.type !== 'admin') {
    // redirect to unauthorized page
    return redirect('/');
  }
};

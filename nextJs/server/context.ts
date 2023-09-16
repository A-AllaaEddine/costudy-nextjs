import type { CreateNextContextOptions } from '@trpc/server/adapters/next';
import { getSession } from 'next-auth/react';
import * as trpc from '@trpc/server';
import { Session, getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

interface CreateInnerContextOptions extends Partial<CreateNextContextOptions> {
  session: Session | null | undefined;
}

export const createContextInner = async (opts?: CreateInnerContextOptions) => {
  return {
    session: opts?.session as Session,
  };
};

export const createContext = async (opts: CreateNextContextOptions) => {
  const session = await getServerSession(opts.req, opts.res, authOptions);
  const contextInner = await createContextInner({ session });

  return {
    ...contextInner,
    req: opts.req,
    res: opts.res,
  };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;

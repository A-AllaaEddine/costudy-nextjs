import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { initTRPC, TRPCError } from '@trpc/server';
import { getServerSession } from 'next-auth';
import superjson from 'superjson';
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.

// Base router and procedure helpers

export const t = initTRPC.create({
  transformer: superjson,

  //

  errorFormatter({ shape }) {
    return shape;
  },
});

export const router = t.router;

const isAuthed = t.middleware(async ({ next, ctx }) => {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
    });
  }
  return next({
    ctx: { ...ctx, session },
  });
});

const isAdmin = t.middleware(async ({ next, ctx }) => {
  const session = await getServerSession(authOptions);
  if (session?.user?.type !== 'admin') {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
    });
  }
  return next({
    ctx: { ...ctx, session },
  });
});
export const middleware = t.middleware;

// public procedure
export const publicProcedure = t.procedure;

//private procedure
export const protectedProcedure = t.procedure.use(isAuthed);

// admin procedure
export const adminProcedure = t.procedure.use(isAdmin);

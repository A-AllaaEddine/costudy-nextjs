import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { Context } from './context';
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.

// Base router and procedure helpers

export const t = initTRPC.context<Context>().create({
  transformer: superjson,

  //

  errorFormatter({ shape }) {
    return shape;
  },
});

export const router = t.router;

const isAuthed = t.middleware(({ next, ctx }) => {
  if (!ctx.session?.user?.email) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
    });
  }
  return next({
    ctx,
  });
});

const isAdmin = t.middleware(({ next, ctx }) => {
  if (ctx.session?.user?.type !== 'admin') {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
    });
  }
  return next({
    ctx,
  });
});
export const middleware = t.middleware;

// public procedure
export const publicProcedure = t.procedure;

//private procedure
export const protectedProcedure = t.procedure.use(isAuthed);

// admin procedure
export const adminProcedure = t.procedure.use(isAdmin);

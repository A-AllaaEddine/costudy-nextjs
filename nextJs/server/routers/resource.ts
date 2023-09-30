import { z } from 'zod';
import { adminProcedure, publicProcedure, router } from '../trpc';
import { prisma } from '@/utils/prisma';

export const resourceRouter = router({
  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      try {
        const resource = await prisma.resource.findUnique({
          where: {
            id: input?.id,
          },
        });
        return resource || {};
      } catch (error: any) {
        console.log(error);
        throw error;
      }
    }),
});

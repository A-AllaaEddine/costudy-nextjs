import { protectedProcedure, publicProcedure, router } from '../trpc';
import { z } from 'zod';
import { prisma } from '@/utils/prisma';

export const viewsRouter = router({
  count: router({
    get: publicProcedure
      .input(
        z.object({
          id: z.string(),
        })
      )
      .query(async ({ input }) => {
        try {
          const viewsCount = await prisma.view.count({
            where: {
              resource_id: input?.id,
            },
          });
          return viewsCount || 0;
        } catch (error: any) {
          console.log(error);
          throw error;
        }
      }),
  }),
  add: protectedProcedure.mutation(async ({ input, ctx: { session } }) => {
    try {
    } catch (error: any) {
      console.log(error);
      throw error;
    }
  }),
});

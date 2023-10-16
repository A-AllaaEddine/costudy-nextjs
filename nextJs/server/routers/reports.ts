import { prisma } from '@/utils/prisma';
import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';

export const reportsRouter = router({
  add: protectedProcedure
    .input(
      z.object({
        resourceId: z.string(),
        tag: z.string(),
        type: z.string(),
        reason: z.string(),
      })
    )
    .mutation(async ({ input, ctx: { session } }) => {
      try {
        const exist = await prisma.report.findFirst({
          where: {
            user_id: session?.user?.id,
            resource_id: input?.resourceId,
          },
        });

        if (exist) {
          throw new Error('already reported');
        }
        await prisma.report.create({
          data: {
            user_id: session?.user?.id, // Connect to the user by ObjectID
            type: input?.type,
            resource_id: input?.resourceId, // Connect to the resource by ObjectID
            tag: input?.tag,
            status: 'Open',
            reason: input?.reason,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
      } catch (error: any) {
        console.error(error);
        throw error;
      }
    }),
});

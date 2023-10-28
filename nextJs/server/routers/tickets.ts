import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { prisma } from '@/utils/prisma';

export const ticketsRouter = router({
  add: publicProcedure
    .input(
      z.object({
        email: z.string(),
        subject: z.string(),
        message: z.string(),
        tag: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const exist = await prisma.ticket.findUnique({
          where: {
            email: input?.email,
            NOT: {
              status: 'Closed',
            },
          },
        });

        if (exist) {
          throw new Error('ticket exist');
        }

        await prisma.ticket.create({
          data: {
            ...input,
            status: 'Open',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
      } catch (error: any) {
        console.log(error);
        throw error;
      }
    }),
});

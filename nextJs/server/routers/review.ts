import { z } from 'zod';
import { protectedProcedure, publicProcedure, router } from '../trpc';
import { prisma } from '@/utils/prisma';

export const reviewsRouter = router({
  website: router({
    create: protectedProcedure
      .input(
        z.object({
          userId: z.string(),
          username: z.string(),
          rating: z.number(),
          review: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        const { userId, username, rating, review } = input;
        try {
          await prisma.websiteReview.create({
            data: {
              userId,
              username,
              rating,
              review,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          });
        } catch (error: any) {
          console.log(error);
          throw error;
        }
      }),
  }),
  user: router({
    create: protectedProcedure
      .input(
        z.object({
          userId: z.string(),
          username: z.string(),
          rating: z.number(),
          review: z.string(),
          isRecommended: z.boolean(),
        })
      )
      .mutation(async ({ input }) => {
        const { userId, username, rating, review, isRecommended } = input;
        try {
          await prisma.usersReview.create({
            data: {
              userId,
              username,
              rating,
              review,
              isRecommended,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          });
        } catch (error: any) {
          console.log(error);
          throw error;
        }
      }),
  }),
  get: publicProcedure
    .input(
      z.object({
        page: z.number(),
        keyword: z.string().optional(),
        major: z.string().optional(),
        degree: z.string().optional(),
        year: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      // Retrieve users from a datasource, this is an imaginary database
      // const data = await getResources(input);

      // return data;
      return {};
    }),
});

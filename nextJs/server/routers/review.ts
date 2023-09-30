import { z } from 'zod';
import { protectedProcedure, publicProcedure, router } from '../trpc';
import { prisma } from '@/utils/prisma';

export const reviewsRouter = router({
  website: router({
    add: protectedProcedure
      .input(
        z.object({
          rating: z.number(),
          review: z.string(),
        })
      )
      .mutation(async ({ input, ctx: { session } }) => {
        const { rating, review } = input;
        try {
          const exist = await prisma.websiteReview.findUnique({
            where: {
              user_id: session?.user?.id,
            },
          });

          if (exist) {
            throw new Error('Review exists already.');
          }
          await prisma.websiteReview.create({
            data: {
              user: {
                connect: {
                  id: session?.user?.id, // Connect to the user by ObjectID
                },
              },
              username: session?.user?.username,
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
  resource: router({
    add: protectedProcedure
      .input(
        z.object({
          id: z.string(),
          rating: z.number(),
          review: z.string(),
          isRecommended: z.boolean(),
        })
      )
      .mutation(async ({ input, ctx: { session } }) => {
        const { rating, review, isRecommended } = input;
        try {
          const exist = await prisma.resourcesReview.findUnique({
            where: {
              user_id: session?.user?.id,
              resource_id: input?.id,
            },
          });

          if (exist) {
            throw new Error('Review exists already.');
          }

          await prisma.resourcesReview.create({
            data: {
              user: {
                connect: {
                  id: session?.user?.id, // Connect to the user by ObjectID
                },
              },
              resource: {
                connect: {
                  id: input?.id, // Connect to the resource by ObjectID
                },
              },
              username: session?.user?.username,
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
  count: router({
    get: publicProcedure
      .input(
        z.object({
          id: z.string(),
        })
      )
      .query(async ({ input }) => {
        try {
          const [reviewsCount, positiveReviewsCount, ratingCount] =
            await prisma.$transaction([
              prisma.resourcesReview.count({
                where: {
                  resource_id: input?.id,
                },
              }),
              prisma.resourcesReview.count({
                where: {
                  resource_id: input?.id,
                  isRecommended: true,
                },
              }),
              prisma.resourcesReview.findMany({
                where: {
                  resource_id: input?.id,
                },
                select: {
                  rating: true,
                },
              }),
            ]);
          let totalRating = 0;
          for (const rating of ratingCount) {
            totalRating += rating.rating;
          }

          const recommendation = (reviewsCount / positiveReviewsCount) * 100;
          const rating = totalRating / reviewsCount;

          return { recommendation: recommendation || 0, rating: rating || 0 };
        } catch (error: any) {
          console.log(error);
          throw error;
        }
      }),
  }),
});

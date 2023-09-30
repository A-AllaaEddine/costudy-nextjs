import { getResources } from '@/utils/mongo';
import { prisma } from '@/utils/prisma';
import { z } from 'zod';
import { adminProcedure, publicProcedure, router } from '../trpc';

export const resourcesRouter = router({
  home: router({
    get: publicProcedure.query(async () => {
      // Retrieve users from a datasource, this is an imaginary database

      try {
        const resources = await prisma.resource.findMany({
          take: 10,
          orderBy: {
            createdAt: 'asc',
          },
        });
        return resources || [];
      } catch (error: any) {
        console.log(error);
        throw error;
      }
    }),
  }),
  page: router({
    get: publicProcedure
      .input(
        z.object({
          cursor: z.string().nullish(),
          keyword: z.string().optional(),
          class: z.string().optional(),
          major: z.string().optional(),
          degree: z.string().optional(),
          year: z.string().optional(),
        })
      )
      .query(async ({ input }) => {
        const { keyword, major, degree, year, cursor } = input;
        // Retrieve users from a datasource, this is an imaginary database

        try {
          const limit = 30;
          const where: {
            OR?: [
              {
                title: {
                  contains: string;
                };
              },
            ];
            year?: string;
            class?: string;
            major?: string;
            degree?: string;
          } = {};

          if (keyword) {
            where.OR = [
              {
                title: {
                  contains: keyword,
                },
              },
            ];
          }
          if (year) {
            where.year = year;
          }
          if (major) {
            where.major = major;
          }
          if (degree) {
            where.degree = degree;
          }

          const data = await prisma.resource.findMany({
            take: limit + 1,
            where: where,

            cursor: cursor ? { id: cursor } : undefined,
            orderBy: {
              createdAt: 'asc',
            },
          });

          let nextPage: typeof cursor | undefined = undefined;
          if (data.length > limit) {
            const nextItem = data.pop();
            nextPage = nextItem!.id;
          }
          return {
            data,
            nextPage,
          };
        } catch (error: any) {
          console.log(error);
          throw error;
        }
      }),
  }),
});

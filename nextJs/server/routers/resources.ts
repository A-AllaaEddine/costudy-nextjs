import { getHomePageResources, getResources } from '@/utils/mongo';
import { publicProcedure, router } from '../trpc';
import { z } from 'zod';
import { Resource } from '@/types/types';

export const resourcesRouter = router({
  home: router({
    get: publicProcedure.query(async () => {
      // Retrieve users from a datasource, this is an imaginary database
      const data = await getHomePageResources();

      return data;
    }),
  }),
  page: router({
    get: publicProcedure
      .input(
        z.object({
          cursor: z.number().nullish(),
          page: z.number(),
          keyword: z.string().optional(),
          major: z.string().optional(),
          degree: z.string().optional(),
          year: z.string().optional(),
        })
      )
      .query(async (opts) => {
        const { page, keyword, major, degree, year, cursor } = opts.input;
        // Retrieve users from a datasource, this is an imaginary database

        //add prisma
        const data = await getResources({
          page: cursor ?? page,
          keyword,
          major,
          degree,
          year,
        });

        let nextPage = undefined;
        if (data.length === 10) {
          nextPage = cursor ? cursor + 1 : page + 1;
        }
        return {
          data,
          nextPage,
        };
      }),
  }),
});

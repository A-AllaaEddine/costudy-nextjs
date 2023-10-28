import { prisma } from '@/utils/prisma';
import { z } from 'zod';
import { protectedProcedure, publicProcedure, router } from '../trpc';

export const eventsRouter = router({
  page: router({
    add: publicProcedure
      .input(
        z.object({
          userId: z.string(),
          page: z.string(),
          referrer: z.string(),
          landingPage: z.boolean(),
          userAgent: z.string(),
          platform: z.string(),
          language: z.string(),
          location: z.object({
            lat: z.number(),
            long: z.number(),
          }),
          screenSize: z.object({
            width: z.number(),
            height: z.number(),
          }),
          browser: z.string(),
          device: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        const {
          userId,
          page,
          referrer,
          landingPage,
          userAgent,
          platform,
          location,
          screenSize,
          browser,
          language,
          device,
        } = input;
        try {
          await prisma.pageView.create({
            data: {
              eventType: 'page_view',
              page,
              referrer,
              viewer_id: userId,
              landingPage,
              userAgent,
              platform,
              location,
              screenSize,
              language,
              browser,
              device,
              createdAt: new Date(),
            },
          });
        } catch (error: any) {
          console.log(error);
          throw error;
        }
      }),
  }),
  downloads: router({
    add: protectedProcedure
      .input(
        z.object({
          id: z.string(),
        })
      )
      .mutation(async ({ input, ctx: { session } }) => {
        try {
          if (session?.user?.id) {
            // const exist = await prisma.download.findUnique({
            //   where: {
            //     user_id: session?.user?.id,
            //     resource_id: input?.id,
            //   },
            // });

            // if (exist) {
            //   return;
            // }

            await prisma.$transaction([
              prisma.download.create({
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
                  createdAt: new Date(),
                },
              }),
              prisma.resource.update({
                where: {
                  id: input?.id,
                },
                data: {
                  totalDownloads: {
                    increment: 1,
                  },
                },
              }),
            ]);
          }
        } catch (error: any) {
          console.log(error);
          throw error;
        }
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
            const downloadCount = await prisma.download.count({
              where: {
                resource_id: input?.id,
              },
            });

            return downloadCount || 0;
          } catch (error: any) {
            console.log(error);
            throw error;
          }
        }),
    }),
  }),
  views: router({
    resource: publicProcedure
      .input(
        z.object({
          title: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          // const exist = await prisma.view.findFirst({
          //   where: {
          //     resource_title: input?.title,
          //   },
          // });

          // if (exist) {
          //   return;
          // }

          await prisma.view.create({
            data: {
              resource_title: input?.title,
              event_type: 'resource_view',
              createdAt: new Date(),
            },
          });
        } catch (error: any) {
          console.log(error);
          throw error;
        }
      }),
  }),
});

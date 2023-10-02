import { prisma } from '@/utils/prisma';
import { z } from 'zod';
import { publicProcedure, router } from '../trpc';

export const eventsRouter = router({
  views: router({
    // add: publicProcedure
    //   .input(
    //     z.object({
    //       userId: z.string(),
    //       resourceId: z.string(),
    //     })
    //   )
    //   .mutation(async ({ input }) => {
    //     try {
    //       const twentyFourHoursAgo = new Date();
    //       twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    //       const exist = await prisma.resourceView.findUnique({
    //         where: {
    //           user_id: input?.userId,
    //           resource_id: input?.resourceId,
    //           createdAt: {
    //             gte: twentyFourHoursAgo,
    //           },
    //         },
    //       });
    //       if (exist) {
    //         throw new Error('Event exists already.');
    //       }

    //       await prisma.resourceView.create({
    //         data: {
    //           user: {
    //             connect: {
    //               id: input?.userId, // Connect to the user by ObjectID
    //             },
    //           },
    //           resource: {
    //             connect: {
    //               id: input?.resourceId, // Connect to the resource by ObjectID
    //             },
    //           },
    //           eventType: 'resourceView',
    //           createdAt: new Date(),
    //         },
    //       });
    //     } catch (error: any) {
    //       console.log(error);
    //       throw error;
    //     }
    //   }),
    addTest: publicProcedure
      .input(
        z.object({
          pageAccessData: z
            .object({
              event: z.string(),
              page: z.string(),
            })
            .optional(),
          deviceData: z
            .object({
              event: z.string(),
              userAgent: z.string(),
              platform: z.string(),
              language: z.string(),
            })
            .optional(),
          referrerData: z
            .object({
              event: z.string(),
              referrer: z.string(),
            })
            .optional(),
          screenSizeData: z
            .object({
              event: z.string(),
              screenWidth: z.number(),
              screenHeight: z.number(),
            })
            .optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const twentyFourHoursAgo = new Date();
          twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

          console.log(input);
          // const exist = await prisma.resourceView.findUnique({
          //   where: {
          //     user_id: input?.userId,
          //     resource_id: input?.resourceId,
          //     createdAt: {
          //       gte: twentyFourHoursAgo,
          //     },
          //   },
          // });
          // if (exist) {
          //   throw new Error('Event exists already.');
          // }

          // await prisma.resourceView.create({
          //   data: {
          //     user: {
          //       connect: {
          //         id: input?.userId, // Connect to the user by ObjectID
          //       },
          //     },
          //     resource: {
          //       connect: {
          //         id: input?.resourceId, // Connect to the resource by ObjectID
          //       },
          //     },
          //     eventType: 'resourceView',
          //     createdAt: new Date(),
          //   },
          // });
        } catch (error: any) {
          console.log(error);
          throw error;
        }
      }),
    device: router({
      add: publicProcedure
        .input(
          z.object({
            userId: z.string(),
            userAgent: z.string(),
            platform: z.string(),
            language: z.string(),
            browser: z.string(),
            location: z.object({
              lat: z.number(),
              long: z.number(),
            }),
            screenSize: z.object({
              width: z.number(),
              height: z.number(),
            }),
          })
        )
        .mutation(async ({ input }) => {
          const {
            userId,
            userAgent,
            platform,
            language,
            browser,
            location,
            screenSize,
          } = input;
          try {
            await prisma.device.create({
              data: {
                userId,
                eventType: 'device_data',
                platform,
                language,
                userAgent,
                browser,
                location,
                screenSize,
                createdAt: new Date(),
              },
            });
          } catch (error: any) {
            console.log(error);
            throw error;
          }
        }),
    }),
    resource: router({
      add: publicProcedure
        .input(
          z.object({
            userId: z.string(),
            resourceId: z.string(),
            referrer: z.string(),
          })
        )
        .mutation(async ({ input }) => {
          const { userId, resourceId, referrer } = input;
          try {
            await prisma.resourceView.create({
              data: {
                userId,
                eventType: 'resource_view',
                referrer,
                createdAt: new Date(),
                resource: {
                  connect: {
                    id: resourceId,
                  },
                },
              },
            });
          } catch (error: any) {
            console.log(error);
            throw error;
          }
        }),
    }),
  }),
  downloads: router({
    add: publicProcedure
      .input(
        z.object({
          id: z.string(),
        })
      )
      .mutation(async ({ input, ctx: { session } }) => {
        try {
          if (session?.user?.id) {
            const exist = await prisma.download.findUnique({
              where: {
                user_id: session?.user?.id,
                resource_id: input?.id,
              },
            });

            if (exist) {
              return;
            }

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
});

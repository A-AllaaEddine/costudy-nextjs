import { hashPassword, verifyPassword } from '@/utils/bcryptUtils';
import { prisma } from '@/utils/prisma';
import { z } from 'zod';
import { adminProcedure, router } from '../trpc';

export const adminRouter = router({
  users: router({
    get: adminProcedure
      .input(
        z.object({
          cursor: z.string().nullish(),
          keyword: z.string().optional(),
        })
      )
      .query(async ({ input }) => {
        const { cursor, keyword } = input;

        const limit = 30;

        const where: {
          name?: string;
          type: 'user';
        } = { type: 'user' };

        if (keyword) {
          where.name = keyword;
        }

        try {
          const data = await prisma.user.findMany({
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
    growth: adminProcedure
      .input(
        z.object({
          year: z.number(),
        })
      )
      .query(async ({ input }) => {
        const { year } = input;

        try {
          // Initialize an array to store the results
          const userCountsByMonth = [];
          // Array of month names for formatting
          const monthNames = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
          ];

          // Loop through each month of the year
          for (let month = 1; month <= 12; month++) {
            // Get the first and last day of the current month
            const firstDayOfMonth = new Date(year, month - 1, 1);
            const lastDayOfMonth = new Date(year, month, 0, 23, 59, 59, 999); // Last day of the month at 23:59:59.999

            // Calculate the user count for the current month
            const userCount = await prisma.user.count({
              where: {
                accountStatus: 'active',
                createdAt: {
                  gte: firstDayOfMonth,
                  lte: lastDayOfMonth,
                },
              },
            });

            // Add the result to the array
            userCountsByMonth.push({
              name: monthNames[month - 1].slice(0, 3),
              total: userCount,
            });
          }
          return userCountsByMonth;
        } catch (error: any) {
          console.log(error);
          throw error;
        }
      }),
    count: adminProcedure.query(async ({ input }) => {
      const currentDate = new Date(); // Get the current date
      const currentMonth = currentDate.getMonth() + 1; // Add 1 to the month because months are 0-indexed
      const startDate = new Date(
        currentDate.getFullYear(),
        currentMonth - 1,
        1
      ); // Subtract 1 to get the correct month
      try {
        const [currentUsersTotal, lastUsersTotal] = await Promise.allSettled([
          prisma.user.count({
            where: {
              accountStatus: 'active',
            },
          }),
          prisma.user.count({
            where: {
              accountStatus: 'active',
              createdAt: {
                lt: startDate,
              },
            },
          }),
        ]);

        let totalCount = 0,
          lastCount = 0,
          percentageGrowth = 0;

        if (currentUsersTotal.status === 'fulfilled') {
          totalCount = currentUsersTotal.value;
        }
        if (lastUsersTotal.status === 'fulfilled') {
          lastCount = lastUsersTotal.value;
        }

        if (lastCount === 0) {
          percentageGrowth = 100; // Handle the case where previousMonthCount is 0
        } else {
          percentageGrowth = ((totalCount - lastCount) / lastCount) * 100;
        }

        return {
          currentUsersTotal: totalCount,
          growth: percentageGrowth,
        };
      } catch (error: any) {
        console.log(error);
        throw error;
      }
    }),
    getLast: adminProcedure.query(async () => {
      try {
        const currentData = new Date();
        const firstDayOfMonth = new Date(
          currentData.getFullYear(),
          currentData.getMonth(),
          1
        );

        const [lastestUsersResp, monthUsersResp] = await Promise.allSettled([
          prisma.user.findMany({
            orderBy: {
              createdAt: 'asc',
            },
            take: 8,
          }),
          prisma.user.count({
            where: {
              createdAt: {
                gte: firstDayOfMonth,
              },
            },
          }),
        ]);
        let lastestUsers: any = [],
          monthUsers = 0;
        if (lastestUsersResp.status === 'fulfilled') {
          lastestUsers = lastestUsersResp.value;
        }
        if (monthUsersResp.status === 'fulfilled') {
          monthUsers = monthUsersResp.value;
        }

        return { lastestUsers, monthUsers: monthUsers || 0 } || {};
      } catch (error: any) {
        console.log(error);
        throw error;
      }
    }),
  }),
  user: router({
    get: adminProcedure
      .input(
        z.object({
          id: z.string(),
        })
      )
      .query(async ({ input }) => {
        try {
          const user = await prisma.user.findUnique({
            where: {
              id: input?.id,
            },
          });
          return user || {};
        } catch (error: any) {
          console.log(error);
          throw error;
        }
      }),
    update: adminProcedure
      .input(
        z.object({
          id: z.string(),
          name: z.string().optional(),
          username: z.string().optional(),
          email: z.string().optional(),
          currentPassword: z.string().optional(),
          newPassword: z.string().optional(),
          accountStatus: z.string().optional(),
          profilePicture: z.string().optional(),
          type: z.string().optional(),
          role: z.string().optional(),
          emailVerified: z.boolean().optional(),
        })
      )
      .mutation(async ({ input }) => {
        //   const { email, name, surname, username, type, job, state, city, phone } =
        //     input;

        const {
          id,
          email,
          name,
          username,
          currentPassword,
          newPassword,
          accountStatus,
          profilePicture,
          type,
          role,
          emailVerified,
        } = input;
        try {
          if (currentPassword) {
            const userAuth = await prisma.authentication.findUnique({
              where: {
                id: id,
              },
            });

            if (!userAuth) {
              throw new Error('No User');
            }

            const isValid = await verifyPassword(
              currentPassword,
              userAuth?.password!
            );

            if (!isValid) {
              throw new Error('Wrong Password');
            }

            const hashedPassword = await hashPassword(input?.newPassword!);
            await prisma.authentication.update({
              where: {
                id: id,
              },
              data: {
                password: hashedPassword,
                updatedAt: new Date(),
              },
            });
            return;
          }

          await prisma.user.update({
            where: {
              id: id,
            },
            data: {
              email,
              name,
              username,
              accountStatus,
              profilePicture,
              type,
              emailVerified,
              updatedAt: new Date(),
            },
          });
        } catch (error: any) {
          console.log(error);
          throw new Error(error.message);
        }
      }),
    delete: adminProcedure
      .input(
        z.object({
          id: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          await prisma.$transaction([
            prisma.user.delete({
              where: {
                id: input?.id,
              },
            }),
            prisma.authentication.delete({
              where: {
                id: input?.id,
              },
            }),
          ]);
        } catch (error: any) {
          console.log(error);
          throw new Error(error.message);
        }
      }),
  }),
  resources: router({
    get: adminProcedure
      .input(
        z.object({
          cursor: z.string().nullish(),
          keyword: z.string().optional(),
        })
      )
      .query(async ({ input }) => {
        const { cursor, keyword } = input;

        const limit = 10;

        const where: {
          OR: [
            {
              title: {
                contains: string;
              };
            },
          ];
        } = {
          OR: [
            {
              title: {
                contains: keyword!,
              },
            },
          ],
        };

        try {
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
    count: adminProcedure.query(async ({ input }) => {
      const currentDate = new Date(); // Get the current date
      const currentMonth = currentDate.getMonth() + 1; // Add 1 to the month because months are 0-indexed
      const startDate = new Date(
        currentDate.getFullYear(),
        currentMonth - 1,
        1
      );
      try {
        const [currentResourcesTotal, lastResourcesTotal] =
          await Promise.allSettled([
            prisma.resource.count({}),
            prisma.resource.count({
              where: {
                createdAt: {
                  lt: startDate,
                },
              },
            }),
          ]);

        let totalCount = 0,
          lastCount = 0,
          percentageGrowth = 0;

        if (currentResourcesTotal.status === 'fulfilled') {
          totalCount = currentResourcesTotal.value;
        }
        if (lastResourcesTotal.status === 'fulfilled') {
          lastCount = lastResourcesTotal.value;
        }

        if (lastCount === 0) {
          percentageGrowth = 100; // Handle the case where previousMonthCount is 0
        } else {
          percentageGrowth = ((totalCount - lastCount) / lastCount) * 100;
        }

        return {
          currentResourcesTotal: totalCount,
          growth: percentageGrowth,
        };
      } catch (error: any) {
        console.log(error);
        throw error;
      }
    }),
  }),
  resource: router({
    delete: adminProcedure
      .input(
        z.object({
          id: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          await prisma.resource.delete({
            where: {
              id: input?.id,
            },
          });
        } catch (error: any) {
          console.log(error);
          throw error;
        }
      }),
    update: adminProcedure
      .input(
        z.object({
          id: z.string(),
          title: z.string().optional(),
          description: z.string().optional(),
          class: z.string().optional(),
          major: z.string().optional(),
          degree: z.string().optional(),
          year: z.string().optional(),
          by: z.string().optional(),
          thumbnail: z
            .object({
              fileKey: z.string(),
              fileName: z.string(),
              fileSize: z.number(),
              fileUrl: z.string(),
              key: z.string(),
              name: z.string(),
              size: z.number(),
              url: z.string(),
            })
            .optional(),
          file: z
            .object({
              fileKey: z.string(),
              fileName: z.string(),
              fileSize: z.number(),
              fileUrl: z.string(),
              key: z.string(),
              name: z.string(),
              size: z.number(),
              url: z.string(),
            })
            .optional(),
          type: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const {
          id,
          file,
          thumbnail,
          by,
          major,
          degree,
          year,
          description,
          title,
        } = input;
        try {
          await prisma.resource.update({
            where: {
              id: input?.id,
            },
            data: {
              file,
              thumbnail,
              by,
              major,
              degree,
              year,
              description,
              title,
              class: input?.class,
              updatedAt: new Date(),
            },
          });
        } catch (error: any) {
          console.log(error);
          throw error;
        }
      }),
    upload: router({
      file: adminProcedure
        .input(
          z.object({
            title: z.string(),
            description: z.string(),
            class: z.string(),
            major: z.string(),
            degree: z.string(),
            year: z.string(),
            by: z.string(),
            thumbnail: z.object({
              fileKey: z.string(),
              fileName: z.string(),
              fileSize: z.number(),
              fileUrl: z.string(),
              key: z.string(),
              name: z.string(),
              size: z.number(),
              url: z.string(),
            }),
            file: z.object({
              fileKey: z.string(),
              fileName: z.string(),
              fileSize: z.number(),
              fileUrl: z.string(),
              key: z.string(),
              name: z.string(),
              size: z.number(),
              url: z.string(),
            }),
            type: z.string(),
          })
        )
        .mutation(async ({ input, ctx: { session } }) => {
          try {
            const exist = await prisma.resource.findUnique({
              where: {
                title: input?.title,
              },
            });

            if (exist) {
              throw new Error('Resource exist');
            }

            await prisma.resource.create({
              data: {
                ...input,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            });
          } catch (error: any) {
            console.log(error);
            throw error;
          }
        }),

      video: adminProcedure
        .input(
          z.object({
            title: z.string(),
            description: z.string(),
            class: z.string(),
            major: z.string(),
            degree: z.string(),
            year: z.string(),
            by: z.string(),
            thumbnail: z.object({
              fileKey: z.string(),
              fileName: z.string(),
              fileSize: z.number(),
              fileUrl: z.string(),
              key: z.string(),
              name: z.string(),
              size: z.number(),
              url: z.string(),
            }),
            video: z.object({
              url: z.string(),
            }),
            type: z.string(),
          })
        )
        .mutation(async ({ input, ctx: { session } }) => {
          try {
            const exist = await prisma.resource.findUnique({
              where: {
                title: input?.title,
              },
            });

            if (exist) {
              throw new Error('Resource exist');
            }

            await prisma.resource.create({
              data: {
                ...input,
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
  }),
  reports: router({
    get: adminProcedure
      .input(
        z.object({
          cursor: z.string().nullish(),
          keyword: z.string().optional(),
          tag: z.string().optional(),
        })
      )
      .query(async ({ input }) => {
        const { cursor, keyword, tag } = input;

        const limit = 30;

        const where: {
          name?: string;
          tag?: string;
          reason?: {
            contains: string;
          };
        } = {};

        if (keyword) {
          where.reason = { contains: keyword };
        }
        if (tag) {
          where.tag = tag;
        }

        try {
          const data = await prisma.report.findMany({
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
    update: adminProcedure
      .input(
        z.object({
          id: z.string(),
          status: z.string().optional(),
          tag: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { status, tag } = input;
        try {
          await prisma.report.update({
            where: {
              id: input?.id,
            },
            data: {
              status,
              tag,
              updatedAt: new Date(),
            },
          });
        } catch (error: any) {
          console.log(error);
          throw error;
        }
      }),
    delete: adminProcedure
      .input(
        z.object({
          id: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          await prisma.report.delete({
            where: {
              id: input?.id,
            },
          });
        } catch (error: any) {
          console.log(error);
          throw error;
        }
      }),
  }),
  events: router({
    views: router({
      growth: adminProcedure
        .input(
          z.object({
            id: z.string(),
          })
        )
        .query(async ({ input }) => {
          if (!input?.id) return [];

          try {
            const currentYear = new Date().getFullYear();

            // Initialize an array to store the results
            const resourceCountsByMonth = [];
            // Array of month names for formatting
            const monthNames = [
              'January',
              'February',
              'March',
              'April',
              'May',
              'June',
              'July',
              'August',
              'September',
              'October',
              'November',
              'December',
            ];

            for (let month = 1; month <= 12; month++) {
              // Get the first and last day of the current month
              const firstDayOfMonth = new Date(
                new Date().getFullYear(),
                month - 1,
                1
              );
              const lastDayOfMonth = new Date(
                currentYear,
                month,
                0,
                23,
                59,
                59,
                999
              ); // Last day of the month at 23:59:59.999

              // Calculate the user count for the current month
              const resourceCount = await prisma.resourceView.count({
                where: {
                  resource_id: input?.id,
                  createdAt: {
                    gte: firstDayOfMonth,
                    lte: lastDayOfMonth,
                  },
                },
              });

              // Add the result to the array
              resourceCountsByMonth.push({
                name: monthNames[month - 1].slice(0, 3),
                total: resourceCount,
              });
            }

            return resourceCountsByMonth;
          } catch (error: any) {
            console.log(error);
            throw error;
          }
        }),
    }),
    downloads: router({
      growth: adminProcedure
        .input(
          z.object({
            id: z.string(),
          })
        )
        .query(async ({ input }) => {
          if (!input?.id.length) return [];

          try {
            const currentYear = new Date().getFullYear();

            // Initialize an array to store the results
            const resourceCountsByMonth = [];
            // Array of month names for formatting
            const monthNames = [
              'January',
              'February',
              'March',
              'April',
              'May',
              'June',
              'July',
              'August',
              'September',
              'October',
              'November',
              'December',
            ];

            for (let month = 1; month <= 12; month++) {
              // Get the first and last day of the current month
              const firstDayOfMonth = new Date(
                new Date().getFullYear(),
                month - 1,
                1
              );
              const lastDayOfMonth = new Date(
                currentYear,
                month,
                0,
                23,
                59,
                59,
                999
              ); // Last day of the month at 23:59:59.999

              // Calculate the user count for the current month
              const resourceCount = await prisma.download.count({
                where: {
                  resource_id: input?.id,
                  createdAt: {
                    gte: firstDayOfMonth,
                    lte: lastDayOfMonth,
                  },
                },
              });

              // Add the result to the array
              resourceCountsByMonth.push({
                name: monthNames[month - 1].slice(0, 3),
                total: resourceCount,
              });
            }

            return resourceCountsByMonth;
          } catch (error: any) {
            console.log(error);
            throw error;
          }
        }),
    }),
  }),
});

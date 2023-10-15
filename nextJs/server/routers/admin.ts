import { hashPassword, verifyPassword } from '@/utils/bcryptUtils';
import { prisma } from '@/utils/prisma';
import { z } from 'zod';
import { adminProcedure, router } from '../trpc';
import { promises } from 'nodemailer/lib/xoauth2';
import { viewsRouter } from './admin/events/views';
import { geoRouter } from './admin/events/geo';
import { techsRouter } from './admin/events/techs';
import { utapi } from 'uploadthing/server';
import { Prisma } from '@prisma/client';

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
          range: z.string(),
        })
      )
      .query(async ({ input }) => {
        const { range } = input;

        try {
          const today = new Date();
          // Initialize an array to store the results
          const usersCount = [];

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
          const hourNames = [
            '00',
            '01',
            '02',
            '03',
            '04',
            '05',
            '06',
            '07',
            '08',
            '09',
            '10',
            '11',
            '12',
            '13',
            '14',
            '15',
            '16',
            '17',
            '18',
            '19',
            '20',
            '21',
            '22',
            '23',
          ];
          switch (range) {
            case 'today':
              for (let hour = 0; hour <= 23; hour++) {
                const startHour = new Date(
                  today.getFullYear(),
                  today.getMonth(),
                  today.getDate(),
                  hour,
                  0,
                  0,
                  0
                );
                const endHour = new Date(
                  today.getFullYear(),
                  today.getMonth(),
                  today.getDate(),
                  hour + 1,
                  0,
                  0,
                  0
                );
                const hourlyCount = await prisma.user.count({
                  where: {
                    accountStatus: 'active',
                    createdAt: {
                      gte: startHour,
                      lte: endHour,
                    },
                  },
                });
                usersCount.push({
                  name: hourNames[`${hour}`],
                  pv: hourlyCount,
                });
              }
              break;
            case 'yesterday':
              for (let hour = 0; hour <= 23; hour++) {
                const startHour = new Date(
                  today.getFullYear(),
                  today.getMonth(),
                  today.getDate() - 1,
                  hour,
                  0,
                  0,
                  0
                );
                const endHour = new Date(
                  today.getFullYear(),
                  today.getMonth(),
                  today.getDate() - 1,
                  hour + 1,
                  0,
                  0,
                  0
                );
                const hourlyCount = await prisma.user.count({
                  where: {
                    accountStatus: 'active',
                    createdAt: {
                      gte: startHour,
                      lte: endHour,
                    },
                  },
                });
                usersCount.push({
                  name: hourNames[`${hour}`],
                  pv: hourlyCount,
                });
              }
              break;
            case 'last-week':
              for (let day = 6; day >= 0; day--) {
                const startDay = new Date(
                  today.getFullYear(),
                  today.getMonth(),
                  today.getDate() - day,
                  0,
                  0,
                  0
                );
                const endDay = new Date(
                  today.getFullYear(),
                  today.getMonth(),
                  today.getDate() - day + 1,
                  0,
                  0,
                  0
                );
                const dailyCount = await prisma.user.count({
                  where: {
                    accountStatus: 'active',
                    createdAt: {
                      gte: startDay,
                      lte: endDay,
                    },
                  },
                });
                usersCount.push({
                  name: `${monthNames[startDay.getMonth() - 1].slice(
                    0,
                    3
                  )},${startDay.getDate()}`,
                  pv: dailyCount,
                });
              }
              break;
            case 'last-month':
              const thirtyDaysAgo = new Date(today);
              thirtyDaysAgo.setDate(today.getDate() - 29);

              // Loop through each day of the past 30 days
              for (let day = 0; day < 30; day++) {
                const startOfDay = new Date(
                  thirtyDaysAgo.getFullYear(),
                  thirtyDaysAgo.getMonth(),
                  thirtyDaysAgo.getDate(),
                  0,
                  0,
                  0,
                  0
                );
                const endOfDay = new Date(
                  thirtyDaysAgo.getFullYear(),
                  thirtyDaysAgo.getMonth(),
                  thirtyDaysAgo.getDate(),
                  23,
                  59,
                  59,
                  999
                );

                // Calculate the user count for the current day
                const dailyCount = await prisma.user.count({
                  where: {
                    accountStatus: 'active',
                    createdAt: {
                      gte: startOfDay,
                      lte: endOfDay,
                    },
                  },
                });

                usersCount.push({
                  name: `${
                    thirtyDaysAgo.getMonth() + 1
                  }/${thirtyDaysAgo.getDate()}`, // Format as MM/DD
                  pv: dailyCount,
                });

                // Move to the previous day
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() + 1);
              }
              break;
            case 'current-month':
              const currentMonthStart = new Date(
                today.getFullYear(),
                today.getMonth(),
                1
              );

              // Calculate the end date for the previous month
              const currentMonthEnd = new Date(
                today.getFullYear(),
                today.getMonth() + 1,
                0
              );
              for (let day = 1; day <= currentMonthEnd.getDate(); day++) {
                const startDay = new Date(
                  currentMonthStart.getFullYear(),
                  currentMonthStart.getMonth(),
                  day,
                  0,
                  0,
                  0
                );
                const endDay = new Date(
                  currentMonthStart.getFullYear(),
                  currentMonthStart.getMonth(),
                  day + 1,
                  0,
                  0,
                  0
                );

                // Calculate the user count for the current day
                const dailyCount = await prisma.user.count({
                  where: {
                    accountStatus: 'active',
                    createdAt: {
                      gte: startDay,
                      lt: endDay,
                    },
                  },
                });

                usersCount.push({
                  name: `${startDay.getMonth() + 1},${day}`, // Format as MM/DD
                  pv: dailyCount,
                });
              }
              break;
            case 'previous-month':
              const lastMonthStart = new Date(
                today.getFullYear(),
                today.getMonth() - 1,
                1
              );

              // Calculate the end date for the previous month
              const lastMonthEnd = new Date(
                today.getFullYear(),
                today.getMonth(),
                0
              );
              for (let day = 1; day <= lastMonthEnd.getDate(); day++) {
                const startDay = new Date(
                  lastMonthStart.getFullYear(),
                  lastMonthStart.getMonth(),
                  day,
                  0,
                  0,
                  0
                );
                const endDay = new Date(
                  lastMonthStart.getFullYear(),
                  lastMonthStart.getMonth(),
                  day + 1,
                  0,
                  0,
                  0
                );

                // Calculate the user count for the current day
                const dailyCount = await prisma.user.count({
                  where: {
                    accountStatus: 'active',
                    createdAt: {
                      gte: startDay,
                      lt: endDay,
                    },
                  },
                });

                usersCount.push({
                  name: `${startDay.getMonth() + 1},${day}`, // Format as MM/DD
                  pv: dailyCount,
                });
              }
              break;
            case 'current-year':
              // Loop through each month of the year
              for (let month = 1; month <= 12; month++) {
                // Get the first and last day of the current month
                const firstDayOfMonth = new Date(
                  today.getFullYear(),
                  month - 1,
                  1
                );
                const lastDayOfMonth = new Date(
                  today.getFullYear(),
                  month,
                  0,
                  23,
                  59,
                  59,
                  999
                ); // Last day of the month at 23:59:59.999

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
                usersCount.push({
                  name: monthNames[month - 1].slice(0, 3),
                  pv: userCount,
                });
              }
              break;
            case 'previous-year':
              const previousYearStart = new Date(today.getFullYear() - 1, 0, 1);

              for (let month = 1; month < 12; month++) {
                const firstDayOfMonth = new Date(
                  previousYearStart.getFullYear(),
                  month,
                  1
                );
                const lastDayOfMonth = new Date(
                  previousYearStart.getFullYear(),
                  month + 1,
                  0,
                  23,
                  59,
                  59,
                  999
                );

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

                usersCount.push({
                  name: monthNames[month].slice(0, 3),
                  pv: userCount,
                });
              }
              break;
          }

          return usersCount || [];
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
          sort: z.string().optional(),
        })
      )
      .query(async ({ input }) => {
        const { cursor, keyword, sort } = input;

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

        const orderBy: {
          createdAt?: 'asc';
          totalDownloads?: 'asc';
          totalViews?: 'asc';
        } = {};

        switch (sort) {
          case 'downloads':
            orderBy.totalDownloads = 'asc';
            break;
          case 'views':
            orderBy.totalViews = 'asc';
            break;
          default:
            orderBy.createdAt = 'asc';
            break;
        }

        try {
          const data = await prisma.resource.findMany({
            take: limit + 1,
            where: where,

            cursor: cursor ? { id: cursor } : undefined,
            orderBy,
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
          const deletedRes = await prisma.resource.delete({
            where: {
              id: input?.id,
            },
          });

          let filesToDelete = [
            (deletedRes.thumbnail as Prisma.JsonObject)?.fileKey! as string,
          ];
          if (deletedRes.file) {
            filesToDelete.push(
              (deletedRes.file as Prisma.JsonObject)?.fileKey! as string
            );
          }
          console.log(filesToDelete);
          await utapi.deleteFiles(filesToDelete);
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
              fileKey: z.string().optional(),
              fileName: z.string().optional(),
              fileSize: z.number().optional(),
              fileUrl: z.string().optional(),
              key: z.string().optional(),
              name: z.string().optional(),
              size: z.number().optional(),
              url: z.string().optional(),
            })
            .optional(),
          file: z
            .object({
              fileKey: z.string().optional(),
              fileName: z.string().optional(),
              fileSize: z.number().optional(),
              fileUrl: z.string().optional(),
              key: z.string().optional(),
              name: z.string().optional(),
              size: z.number().optional(),
              url: z.string().optional(),
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
      check: adminProcedure
        .input(
          z.object({
            title: z.string(),
          })
        )
        .mutation(async ({ input }) => {
          try {
            const exist = await prisma.resource.findUnique({
              where: {
                title: input?.title,
              },
            });

            if (exist) {
              throw new Error('Resource exist');
            }
          } catch (error: any) {
            console.log(error);
            throw error;
          }
        }),
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
          sort: z.string().optional(),
        })
      )
      .query(async ({ input }) => {
        const { cursor, keyword, tag, sort } = input;

        const limit = 30;

        const where: {
          name?: string;
          tag?: string;
          reason?: {
            contains: string;
          };
        } = {};

        const orderBy: {
          createdAt?: 'asc';
          totalDownloads?: 'asc';
          totalViews?: 'asc';
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
            orderBy,
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
    resource: router({
      views: router({
        growth: adminProcedure
          .input(
            z.object({
              id: z.string(),
              type: z.string(),
              range: z.string(),
            })
          )
          .query(async ({ input }) => {
            if (!input?.id) return [];
            const { range } = input;

            try {
              const today = new Date();

              // Initialize an array to store the results
              const viewsCounts = [];

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
              const hourNames = [
                '00',
                '01',
                '02',
                '03',
                '04',
                '05',
                '06',
                '07',
                '08',
                '09',
                '10',
                '11',
                '12',
                '13',
                '14',
                '15',
                '16',
                '17',
                '18',
                '19',
                '20',
                '21',
                '22',
                '23',
              ];
              switch (range) {
                case 'today':
                  for (let hour = 0; hour <= 23; hour++) {
                    const startHour = new Date(
                      today.getFullYear(),
                      today.getMonth(),
                      today.getDate(),
                      hour,
                      0,
                      0,
                      0
                    );
                    const endHour = new Date(
                      today.getFullYear(),
                      today.getMonth(),
                      today.getDate(),
                      hour + 1,
                      0,
                      0,
                      0
                    );
                    const page = `/${input?.type}/${input.id}`;
                    const hourlyCount = await prisma.pageView.count({
                      where: {
                        page,
                        createdAt: {
                          gte: startHour,
                          lte: endHour,
                        },
                      },
                    });

                    viewsCounts.push({
                      name: hourNames[`${hour}`],
                      pv: hourlyCount,
                    });
                  }
                  break;
                case 'yesterday':
                  for (let hour = 0; hour <= 23; hour++) {
                    const startHour = new Date(
                      today.getFullYear(),
                      today.getMonth(),
                      today.getDate() - 1,
                      hour,
                      0,
                      0,
                      0
                    );
                    const endHour = new Date(
                      today.getFullYear(),
                      today.getMonth(),
                      today.getDate() - 1,
                      hour + 1,
                      0,
                      0,
                      0
                    );
                    const page = `/${input?.type}/${input.id}`;
                    const hourlyCount = await prisma.pageView.count({
                      where: {
                        page,
                        createdAt: {
                          gte: startHour,
                          lte: endHour,
                        },
                      },
                    });

                    viewsCounts.push({
                      name: hourNames[`${hour}`],
                      pv: hourlyCount,
                    });
                  }
                  break;
                case 'last-week':
                  for (let day = 6; day >= 0; day--) {
                    const startDay = new Date(
                      today.getFullYear(),
                      today.getMonth(),
                      today.getDate() - day,
                      0,
                      0,
                      0
                    );
                    const endDay = new Date(
                      today.getFullYear(),
                      today.getMonth(),
                      today.getDate() - day + 1,
                      0,
                      0,
                      0
                    );
                    const page = `/${input?.type}/${input.id}`;
                    const dailyCount = await prisma.pageView.count({
                      where: {
                        page,
                        createdAt: {
                          gte: startDay,
                          lte: endDay,
                        },
                      },
                    });
                    viewsCounts.push({
                      name: `${monthNames[startDay.getMonth() - 1].slice(
                        0,
                        3
                      )},${startDay.getDate()}`,
                      pv: dailyCount,
                    });
                  }
                  break;
                case 'last-month':
                  const thirtyDaysAgo = new Date(today);
                  thirtyDaysAgo.setDate(today.getDate() - 29);

                  // Loop through each day of the past 30 days
                  for (let day = 0; day < 30; day++) {
                    const startOfDay = new Date(
                      thirtyDaysAgo.getFullYear(),
                      thirtyDaysAgo.getMonth(),
                      thirtyDaysAgo.getDate(),
                      0,
                      0,
                      0,
                      0
                    );
                    const endOfDay = new Date(
                      thirtyDaysAgo.getFullYear(),
                      thirtyDaysAgo.getMonth(),
                      thirtyDaysAgo.getDate(),
                      23,
                      59,
                      59,
                      999
                    );

                    const page = `/${input?.type}/${input.id}`;
                    // Calculate the user count for the current day
                    const dailyCount = await prisma.pageView.count({
                      where: {
                        page,
                        createdAt: {
                          gte: startOfDay,
                          lte: endOfDay,
                        },
                      },
                    });

                    viewsCounts.push({
                      name: `${
                        thirtyDaysAgo.getMonth() + 1
                      }/${thirtyDaysAgo.getDate()}`, // Format as MM/DD
                      pv: dailyCount,
                    });

                    // Move to the previous day
                    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() + 1);
                  }
                  break;
                case 'current-month':
                  const currentMonthStart = new Date(
                    today.getFullYear(),
                    today.getMonth(),
                    1
                  );

                  // Calculate the end date for the previous month
                  const currentMonthEnd = new Date(
                    today.getFullYear(),
                    today.getMonth() + 1,
                    0
                  );
                  for (let day = 1; day <= currentMonthEnd.getDate(); day++) {
                    const startDay = new Date(
                      currentMonthStart.getFullYear(),
                      currentMonthStart.getMonth(),
                      day,
                      0,
                      0,
                      0
                    );
                    const endDay = new Date(
                      currentMonthStart.getFullYear(),
                      currentMonthStart.getMonth(),
                      day + 1,
                      0,
                      0,
                      0
                    );

                    const page = `/${input?.type}/${input.id}`;
                    // Calculate the user count for the current day
                    const dailyCount = await prisma.pageView.count({
                      where: {
                        page,
                        createdAt: {
                          gte: startDay,
                          lt: endDay,
                        },
                      },
                    });

                    viewsCounts.push({
                      name: `${startDay.getMonth() + 1},${day}`, // Format as MM/DD
                      pv: dailyCount,
                    });
                  }
                  break;
                case 'previous-month':
                  const lastMonthStart = new Date(
                    today.getFullYear(),
                    today.getMonth() - 1,
                    1
                  );

                  // Calculate the end date for the previous month
                  const lastMonthEnd = new Date(
                    today.getFullYear(),
                    today.getMonth(),
                    0
                  );
                  for (let day = 1; day <= lastMonthEnd.getDate(); day++) {
                    const startDay = new Date(
                      lastMonthStart.getFullYear(),
                      lastMonthStart.getMonth(),
                      day,
                      0,
                      0,
                      0
                    );
                    const endDay = new Date(
                      lastMonthStart.getFullYear(),
                      lastMonthStart.getMonth(),
                      day + 1,
                      0,
                      0,
                      0
                    );

                    const page = `/${input?.type}/${input.id}`;
                    // Calculate the user count for the current day
                    const dailyCount = await prisma.pageView.count({
                      where: {
                        page,
                        createdAt: {
                          gte: startDay,
                          lt: endDay,
                        },
                      },
                    });

                    viewsCounts.push({
                      name: `${startDay.getMonth() + 1},${day}`, // Format as MM/DD
                      pv: dailyCount,
                    });
                  }
                  break;
                case 'current-year':
                  // Loop through each month of the year
                  for (let month = 1; month <= 12; month++) {
                    // Get the first and last day of the current month
                    const firstDayOfMonth = new Date(
                      today.getFullYear(),
                      month - 1,
                      1
                    );
                    const lastDayOfMonth = new Date(
                      today.getFullYear(),
                      month,
                      0,
                      23,
                      59,
                      59,
                      999
                    ); // Last day of the month at 23:59:59.999

                    const page = `/${input?.type}/${input.id}`;
                    // Calculate the user count for the current month
                    const userCount = await prisma.pageView.count({
                      where: {
                        page,
                        createdAt: {
                          gte: firstDayOfMonth,
                          lte: lastDayOfMonth,
                        },
                      },
                    });

                    // Add the result to the array
                    viewsCounts.push({
                      name: monthNames[month - 1].slice(0, 3),
                      pv: userCount,
                    });
                  }
                  break;
                case 'previous-year':
                  const previousYearStart = new Date(
                    today.getFullYear() - 1,
                    0,
                    1
                  );

                  for (let month = 1; month < 12; month++) {
                    const firstDayOfMonth = new Date(
                      previousYearStart.getFullYear(),
                      month,
                      1
                    );
                    const lastDayOfMonth = new Date(
                      previousYearStart.getFullYear(),
                      month + 1,
                      0,
                      23,
                      59,
                      59,
                      999
                    );

                    const page = `/${input?.type}/${input.id}`;
                    // Calculate the user count for the current month
                    const userCount = await prisma.pageView.count({
                      where: {
                        page,
                        createdAt: {
                          gte: firstDayOfMonth,
                          lte: lastDayOfMonth,
                        },
                      },
                    });

                    viewsCounts.push({
                      name: monthNames[month].slice(0, 3),
                      pv: userCount,
                    });
                  }
                  break;
              }

              return viewsCounts || [];
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
              range: z.string(),
            })
          )
          .query(async ({ input }) => {
            if (!input?.id.length) return [];

            const { range } = input;

            try {
              const today = new Date();

              // Initialize an array to store the results
              const resourceCounts = [];

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
              const hourNames = [
                '00',
                '01',
                '02',
                '03',
                '04',
                '05',
                '06',
                '07',
                '08',
                '09',
                '10',
                '11',
                '12',
                '13',
                '14',
                '15',
                '16',
                '17',
                '18',
                '19',
                '20',
                '21',
                '22',
                '23',
              ];
              switch (range) {
                case 'today':
                  for (let hour = 0; hour <= 23; hour++) {
                    const startHour = new Date(
                      today.getFullYear(),
                      today.getMonth(),
                      today.getDate(),
                      hour,
                      0,
                      0,
                      0
                    );
                    const endHour = new Date(
                      today.getFullYear(),
                      today.getMonth(),
                      today.getDate(),
                      hour + 1,
                      0,
                      0,
                      0
                    );
                    const hourlyCount = await prisma.download.count({
                      where: {
                        resource_id: input?.id,
                        createdAt: {
                          gte: startHour,
                          lte: endHour,
                        },
                      },
                    });
                    resourceCounts.push({
                      name: hourNames[`${hour}`],
                      pv: hourlyCount,
                    });
                  }
                  break;
                case 'yesterday':
                  for (let hour = 0; hour <= 23; hour++) {
                    const startHour = new Date(
                      today.getFullYear(),
                      today.getMonth(),
                      today.getDate() - 1,
                      hour,
                      0,
                      0,
                      0
                    );
                    const endHour = new Date(
                      today.getFullYear(),
                      today.getMonth(),
                      today.getDate() - 1,
                      hour + 1,
                      0,
                      0,
                      0
                    );
                    const hourlyCount = await prisma.download.count({
                      where: {
                        resource_id: input?.id,
                        createdAt: {
                          gte: startHour,
                          lte: endHour,
                        },
                      },
                    });
                    resourceCounts.push({
                      name: hourNames[`${hour}`],
                      pv: hourlyCount,
                    });
                  }
                  break;
                case 'last-week':
                  for (let day = 6; day >= 0; day--) {
                    const startDay = new Date(
                      today.getFullYear(),
                      today.getMonth(),
                      today.getDate() - day,
                      0,
                      0,
                      0
                    );
                    const endDay = new Date(
                      today.getFullYear(),
                      today.getMonth(),
                      today.getDate() - day + 1,
                      0,
                      0,
                      0
                    );
                    const dailyCount = await prisma.download.count({
                      where: {
                        resource_id: input?.id,
                        createdAt: {
                          gte: startDay,
                          lte: endDay,
                        },
                      },
                    });
                    resourceCounts.push({
                      name: `${monthNames[startDay.getMonth() - 1].slice(
                        0,
                        3
                      )},${startDay.getDate()}`,
                      pv: dailyCount,
                    });
                  }
                  break;
                case 'last-month':
                  const thirtyDaysAgo = new Date(today);
                  thirtyDaysAgo.setDate(today.getDate() - 29);

                  // Loop through each day of the past 30 days
                  for (let day = 0; day < 30; day++) {
                    const startOfDay = new Date(
                      thirtyDaysAgo.getFullYear(),
                      thirtyDaysAgo.getMonth(),
                      thirtyDaysAgo.getDate(),
                      0,
                      0,
                      0,
                      0
                    );
                    const endOfDay = new Date(
                      thirtyDaysAgo.getFullYear(),
                      thirtyDaysAgo.getMonth(),
                      thirtyDaysAgo.getDate(),
                      23,
                      59,
                      59,
                      999
                    );

                    // Calculate the user count for the current day
                    const dailyCount = await prisma.download.count({
                      where: {
                        resource_id: input?.id,
                        createdAt: {
                          gte: startOfDay,
                          lte: endOfDay,
                        },
                      },
                    });

                    resourceCounts.push({
                      name: `${
                        thirtyDaysAgo.getMonth() + 1
                      }/${thirtyDaysAgo.getDate()}`, // Format as MM/DD
                      pv: dailyCount,
                    });

                    // Move to the previous day
                    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() + 1);
                  }
                  break;
                case 'current-month':
                  const currentMonthStart = new Date(
                    today.getFullYear(),
                    today.getMonth(),
                    1
                  );

                  // Calculate the end date for the previous month
                  const currentMonthEnd = new Date(
                    today.getFullYear(),
                    today.getMonth() + 1,
                    0
                  );
                  for (let day = 1; day <= currentMonthEnd.getDate(); day++) {
                    const startDay = new Date(
                      currentMonthStart.getFullYear(),
                      currentMonthStart.getMonth(),
                      day,
                      0,
                      0,
                      0
                    );
                    const endDay = new Date(
                      currentMonthStart.getFullYear(),
                      currentMonthStart.getMonth(),
                      day + 1,
                      0,
                      0,
                      0
                    );

                    // Calculate the user count for the current day
                    const dailyCount = await prisma.download.count({
                      where: {
                        resource_id: input?.id,
                        createdAt: {
                          gte: startDay,
                          lt: endDay,
                        },
                      },
                    });

                    resourceCounts.push({
                      name: `${startDay.getMonth() + 1},${day}`, // Format as MM/DD
                      pv: dailyCount,
                    });
                  }
                  break;
                case 'previous-month':
                  const lastMonthStart = new Date(
                    today.getFullYear(),
                    today.getMonth() - 1,
                    1
                  );

                  // Calculate the end date for the previous month
                  const lastMonthEnd = new Date(
                    today.getFullYear(),
                    today.getMonth(),
                    0
                  );
                  for (let day = 1; day <= lastMonthEnd.getDate(); day++) {
                    const startDay = new Date(
                      lastMonthStart.getFullYear(),
                      lastMonthStart.getMonth(),
                      day,
                      0,
                      0,
                      0
                    );
                    const endDay = new Date(
                      lastMonthStart.getFullYear(),
                      lastMonthStart.getMonth(),
                      day + 1,
                      0,
                      0,
                      0
                    );

                    // Calculate the user count for the current day
                    const dailyCount = await prisma.download.count({
                      where: {
                        resource_id: input?.id,
                        createdAt: {
                          gte: startDay,
                          lt: endDay,
                        },
                      },
                    });

                    resourceCounts.push({
                      name: `${startDay.getMonth() + 1},${day}`, // Format as MM/DD
                      pv: dailyCount,
                    });
                  }
                  break;
                case 'current-year':
                  // Loop through each month of the year
                  for (let month = 1; month <= 12; month++) {
                    // Get the first and last day of the current month
                    const firstDayOfMonth = new Date(
                      today.getFullYear(),
                      month - 1,
                      1
                    );
                    const lastDayOfMonth = new Date(
                      today.getFullYear(),
                      month,
                      0,
                      23,
                      59,
                      59,
                      999
                    ); // Last day of the month at 23:59:59.999

                    // Calculate the user count for the current month
                    const userCount = await prisma.download.count({
                      where: {
                        resource_id: input?.id,
                        createdAt: {
                          gte: firstDayOfMonth,
                          lte: lastDayOfMonth,
                        },
                      },
                    });

                    // Add the result to the array
                    resourceCounts.push({
                      name: monthNames[month - 1].slice(0, 3),
                      pv: userCount,
                    });
                  }
                  break;
                case 'previous-year':
                  const previousYearStart = new Date(
                    today.getFullYear() - 1,
                    0,
                    1
                  );

                  for (let month = 1; month < 12; month++) {
                    const firstDayOfMonth = new Date(
                      previousYearStart.getFullYear(),
                      month,
                      1
                    );
                    const lastDayOfMonth = new Date(
                      previousYearStart.getFullYear(),
                      month + 1,
                      0,
                      23,
                      59,
                      59,
                      999
                    );

                    // Calculate the user count for the current month
                    const userCount = await prisma.download.count({
                      where: {
                        resource_id: input?.id,
                        createdAt: {
                          gte: firstDayOfMonth,
                          lte: lastDayOfMonth,
                        },
                      },
                    });

                    resourceCounts.push({
                      name: monthNames[month].slice(0, 3),
                      pv: userCount,
                    });
                  }
                  break;
              }

              return resourceCounts;
            } catch (error: any) {
              console.log(error);
              throw error;
            }
          }),
      }),
    }),
    page: router({
      views: viewsRouter,
      geo: geoRouter,
      tech: techsRouter,
    }),
  }),
});

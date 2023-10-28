import { adminProcedure, router } from '@/server/trpc';
import { prisma } from '@/utils/prisma';
import { z } from 'zod';

export const viewsRouter = router({
  growth: adminProcedure
    .input(
      z.object({
        // username: z.string(),
        range: z.string(),
        behavior: z.string(),
      })
    )
    .query(async ({ input }) => {
      // if (!input?.username) return [];
      const { range, behavior } = input;

      try {
        const today = new Date();

        // Initialize an array to store the results
        const viewsCounts = [];
        let where: {
          landingPage?: boolean;
          createdAt?: {
            gte: Date;
            lte: Date;
          };
        } = {};

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

              where = {
                createdAt: {
                  gte: startHour,
                  lte: endHour,
                },
              };
              if (behavior !== 'page') {
                where.landingPage = true;
              }

              const hourlyCount = await prisma.pageView.count({
                where,
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

              where = {
                createdAt: {
                  gte: startHour,
                  lte: endHour,
                },
              };
              if (behavior !== 'page') {
                where.landingPage = true;
              }

              const hourlyCount = await prisma.pageView.count({
                where,
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

              where = {
                createdAt: {
                  gte: startDay,
                  lte: endDay,
                },
              };
              if (behavior !== 'page') {
                where.landingPage = true;
              }

              const dailyCount = await prisma.pageView.count({
                where,
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

              where = {
                createdAt: {
                  gte: startOfDay,
                  lte: endOfDay,
                },
              };
              if (behavior !== 'page') {
                where.landingPage = true;
              }

              // Calculate the user count for the current day
              const dailyCount = await prisma.pageView.count({
                where,
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

              where = {
                createdAt: {
                  gte: startDay,
                  lte: endDay,
                },
              };
              if (behavior !== 'page') {
                where.landingPage = true;
              }

              // Calculate the user count for the current day
              const dailyCount = await prisma.pageView.count({
                where,
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

              where = {
                createdAt: {
                  gte: startDay,
                  lte: endDay,
                },
              };
              if (behavior !== 'page') {
                where.landingPage = true;
              }

              // Calculate the user count for the current day
              const dailyCount = await prisma.pageView.count({
                where,
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

              where = {
                createdAt: {
                  gte: firstDayOfMonth,
                  lte: lastDayOfMonth,
                },
              };
              if (behavior !== 'page') {
                where.landingPage = true;
              }

              // Calculate the user count for the current month
              const userCount = await prisma.pageView.count({
                where,
              });

              // Add the result to the array
              viewsCounts.push({
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

              where = {
                createdAt: {
                  gte: firstDayOfMonth,
                  lte: lastDayOfMonth,
                },
              };
              if (behavior !== 'page') {
                where.landingPage = true;
              }

              // Calculate the user count for the current month
              const userCount = await prisma.pageView.count({
                where,
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
  single: adminProcedure
    .input(
      z.object({
        // username: z.string(),
        range: z.string(),
        behavior: z.string(),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ input }) => {
      // if (!input?.username) return [];
      const { range, cursor, behavior } = input;

      const limit = 20;
      let nextPage: typeof cursor | undefined = undefined;
      let where: {
        landingPage?: boolean;
        createdAt?: {
          gte: Date;
          lte: Date;
        };
      } = {};

      try {
        const today = new Date();

        // Initialize an array to store the results
        const viewsCounts: any = [];
        let totalViews = 0,
          totalCount;

        switch (range) {
          case 'today':
            const todayStartHour = new Date(
              today.getFullYear(),
              today.getMonth(),
              today.getDate(),
              0,
              0,
              0,
              0
            );
            const todayEndHour = new Date(
              today.getFullYear(),
              today.getMonth(),
              today.getDate(),
              59,
              59,
              59,
              59
            );

            where = {
              createdAt: {
                gte: todayStartHour,
                lte: todayEndHour,
              },
            };
            if (behavior !== 'page') {
              where.landingPage = true;
            }
            totalViews = await prisma.pageView.count({
              where,
            });
            totalCount = await prisma.pageView.groupBy({
              by: ['page'],
              _count: {
                createdAt: true,
              },
              where,
            });

            if (totalCount.length > limit) {
              const nextItem = totalCount.pop();
              nextPage = nextItem!.page;
            }

            totalCount.map((hc) => {
              viewsCounts.push({
                page: hc.page,
                count: hc._count.createdAt,
                nextPage,
              });
            });

            break;
          case 'yesterday':
            const yesterdayStartHour = new Date(
              today.getFullYear(),
              today.getMonth(),
              today.getDate() - 1,
              0,
              0,
              0,
              0
            );
            const yesterdayEndHour = new Date(
              today.getFullYear(),
              today.getMonth(),
              today.getDate() - 1,
              59,
              59,
              59,
              59
            );

            where = {
              createdAt: {
                gte: yesterdayStartHour,
                lte: yesterdayEndHour,
              },
            };
            if (behavior !== 'page') {
              where.landingPage = true;
            }
            totalViews = await prisma.pageView.count({
              where,
            });

            totalCount = await prisma.pageView.groupBy({
              by: ['page'],
              _count: {
                createdAt: true,
              },
              where,
            });

            if (totalCount.length > limit) {
              const nextItem = totalCount.pop();
              nextPage = nextItem!.page;
            }

            totalCount.map((hc) => {
              viewsCounts.push({
                page: hc.page,
                count: hc._count.createdAt,
                nextPage,
              });
            });

            break;
          case 'last-week':
            const startDay = new Date(
              today.getFullYear(),
              today.getMonth(),
              today.getDate() - 6,
              0,
              0,
              0
            );
            const endDay = new Date(
              today.getFullYear(),
              today.getMonth(),
              today.getDate(),
              59,
              59,
              59
            );

            where = {
              createdAt: {
                gte: startDay,
                lte: endDay,
              },
            };
            if (behavior !== 'page') {
              where.landingPage = true;
            }
            totalViews = await prisma.pageView.count({
              where,
            });

            totalCount = await prisma.pageView.groupBy({
              by: ['page'],
              _count: {
                createdAt: true,
              },
              where,
            });

            if (totalCount.length > limit) {
              const nextItem = totalCount.pop();
              nextPage = nextItem!.page;
            }

            totalCount.map((hc) => {
              viewsCounts.push({
                page: hc.page,
                count: hc._count.createdAt,
                nextPage,
              });
            });

            break;
          case 'last-month':
            const thirtyDaysAgo = new Date(today);
            thirtyDaysAgo.setDate(today.getDate() - 29);

            // Loop through each day of the past 30 days
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
              today.getFullYear(),
              today.getMonth(),
              today.getDate(),
              59,
              59,
              59
            );

            where = {
              createdAt: {
                gte: startOfDay,
                lte: endOfDay,
              },
            };
            if (behavior !== 'page') {
              where.landingPage = true;
            }

            totalViews = await prisma.pageView.count({
              where,
            });

            totalCount = await prisma.pageView.groupBy({
              by: ['page'],
              _count: {
                createdAt: true,
              },
              where,
            });

            if (totalCount.length > limit) {
              const nextItem = totalCount.pop();
              nextPage = nextItem!.page;
            }

            totalCount.map((hc) => {
              viewsCounts.push({
                page: hc.page,
                count: hc._count.createdAt,
                nextPage,
              });
            });

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

            where = {
              createdAt: {
                gte: currentMonthStart,
                lte: currentMonthEnd,
              },
            };
            if (behavior !== 'page') {
              where.landingPage = true;
            }

            totalViews = await prisma.pageView.count({
              where,
            });

            totalCount = await prisma.pageView.groupBy({
              by: ['page'],
              _count: {
                createdAt: true,
              },
              where,
            });

            if (totalCount.length > limit) {
              const nextItem = totalCount.pop();
              nextPage = nextItem!.page;
            }

            totalCount.map((hc) => {
              viewsCounts.push({
                page: hc.page,
                count: hc._count.createdAt,
                nextPage,
              });
            });

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

            where = {
              createdAt: {
                gte: lastMonthStart,
                lte: lastMonthEnd,
              },
            };
            if (behavior !== 'page') {
              where.landingPage = true;
            }

            totalViews = await prisma.pageView.count({
              where,
            });

            totalCount = await prisma.pageView.groupBy({
              by: ['page'],
              _count: {
                createdAt: true,
              },
              where,
            });

            if (totalCount.length > limit) {
              const nextItem = totalCount.pop();
              nextPage = nextItem!.page;
            }

            totalCount.map((hc) => {
              viewsCounts.push({
                page: hc.page,
                count: hc._count.createdAt,
                nextPage,
              });
            });

            break;
          case 'current-year':
            // Loop through each month of the year
            // Get the first and last day of the current month
            const firstDayOfMonth = new Date(
              today.getFullYear() - 1,
              today.getMonth(),
              today.getDate()
            );
            const lastDayOfMonth = new Date(
              today.getFullYear(),
              today.getMonth(),
              today.getDate()
            ); // Last day of the month at 23:59:59.999

            where = {
              createdAt: {
                gte: firstDayOfMonth,
                lte: lastDayOfMonth,
              },
            };
            if (behavior !== 'page') {
              where.landingPage = true;
            }

            // Calculate the user count for the current month
            totalViews = await prisma.pageView.count({
              where,
            });

            totalCount = await prisma.pageView.groupBy({
              by: ['page'],
              _count: {
                createdAt: true,
              },
              where,
            });

            if (totalCount.length > limit) {
              const nextItem = totalCount.pop();
              nextPage = nextItem!.page;
            }

            totalCount.map((hc) => {
              viewsCounts.push({
                page: hc.page,
                count: hc._count.createdAt,
                nextPage,
              });
            });

            break;
          case 'previous-year':
            const previousYearStart = new Date(today.getFullYear() - 1, 0, 1);

            const firstDayOfYear = new Date(
              previousYearStart.getFullYear(),
              previousYearStart.getMonth(),
              1
            );
            const lastDayOfYear = new Date(
              previousYearStart.getFullYear(),
              previousYearStart.getMonth() + 1,
              0,
              23,
              59,
              59,
              999
            );

            where = {
              createdAt: {
                gte: firstDayOfYear,
                lte: lastDayOfYear,
              },
            };
            if (behavior !== 'page') {
              where.landingPage = true;
            }

            totalViews = await prisma.pageView.count({
              where,
            });

            totalCount = await prisma.pageView.groupBy({
              by: ['page'],
              _count: {
                createdAt: true,
              },
              where,
            });

            if (totalCount.length > limit) {
              const nextItem = totalCount.pop();
              nextPage = nextItem!.page;
            }

            totalCount.map((hc) => {
              viewsCounts.push({
                page: hc.page,
                count: hc._count.createdAt,
                nextPage,
              });
            });

            break;
        }

        return (
          {
            pagesViews: viewsCounts || [],
            totalViews: totalViews || 0,
            nextPage,
          } || {}
        );
      } catch (error: any) {
        console.log(error);
        throw error;
      }
    }),
});

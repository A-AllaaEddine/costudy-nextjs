import { adminProcedure, router } from '@/server/trpc';
import { prisma } from '@/utils/prisma';
import { z } from 'zod';

export const techsRouter = router({
  device: router({
    growth: adminProcedure
      .input(
        z.object({
          // username: z.string(),
          range: z.string(),
        })
      )
      .query(async ({ input }) => {
        // if (!input?.username) return [];
        const { range } = input;
        const fields = ['pv', 'uv', 'hv'];
        let indexOfBiggestArray: number = 0;

        try {
          const today = new Date();

          // Initialize an array to store the results
          let viewsCounts: any = [];
          let where: {
            createdAt?: {
              gte: Date;
              lte: Date;
            };
          } = {};

          let data: any = [],
            obj: {
              name?: string;
            } & Record<string, any> = {};
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

                const hourlyCount = await prisma.pageView.groupBy({
                  by: ['device'],
                  _count: {
                    createdAt: true,
                  },
                  where,
                });

                data.push(hourlyCount);
                obj = {
                  name: hourNames[`${hour}`],
                };
                viewsCounts.push(obj);

                // if (hourlyCount.length) {
                //   for (let i = 0; i < hourlyCount.length; i++) {
                //     obj[fields[i]] = hourlyCount[i]._count.createdAt;
                //   }
                // } else {
                //   obj['pv'] = 0;
                //   obj['uv'] = 0;
                // }
              }
              indexOfBiggestArray = data.reduce(
                (maxIndex: any, currentArray: any, currentIndex: any) => {
                  if (currentArray.length > data[maxIndex].length) {
                    return currentIndex;
                  }
                  return maxIndex;
                },
                0
              );
              data.map((dataArray: any, idx: number) => {
                const obj: any = viewsCounts[idx]; // You can replace 'some_hour' with your actual value
                const fieldCount = data[indexOfBiggestArray].length || 1; // Ensure there's at least 1 field (e.g., 'pv')

                fields.slice(0, fieldCount).forEach((field, index) => {
                  viewsCounts[idx][field] = dataArray[index]
                    ? dataArray[index]._count.createdAt
                    : 0;
                });

                return obj;
              });
              // console.log(result);
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

                const hourlyCount = await prisma.pageView.groupBy({
                  by: ['device'],
                  _count: {
                    createdAt: true,
                  },
                  where,
                });

                data.push(hourlyCount);
                obj = {
                  name: hourNames[`${hour}`],
                };
                viewsCounts.push(obj);
                // let obj: {
                //   name: string;
                // } & Record<string, any> = {
                //   name: hourNames[`${hour}`],
                // };

                // if (hourlyCount.length) {
                //   for (let i = 0; i < hourlyCount.length; i++) {
                //     obj[fields[i]] = hourlyCount[i]._count.createdAt;
                //   }
                // } else {
                //   obj['pv'] = 0;
                // }
                // viewsCounts.push(obj);
              }
              indexOfBiggestArray = data.reduce(
                (maxIndex: any, currentArray: any, currentIndex: any) => {
                  if (currentArray.length > data[maxIndex].length) {
                    return currentIndex;
                  }
                  return maxIndex;
                },
                0
              );
              data.map((dataArray: any, idx: number) => {
                const obj: any = viewsCounts[idx]; // You can replace 'some_hour' with your actual value
                const fieldCount = data[indexOfBiggestArray].length || 1; // Ensure there's at least 1 field (e.g., 'pv')

                fields.slice(0, fieldCount).forEach((field, index) => {
                  viewsCounts[idx][field] = dataArray[index]
                    ? dataArray[index]._count.createdAt
                    : 0;
                });
              });
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

                const dailyCount = await prisma.pageView.groupBy({
                  by: ['device'],
                  _count: {
                    createdAt: true,
                  },
                  where,
                });

                // let obj: {
                //   name: string;
                // } & Record<string, any> = {
                //   name: `${monthNames[startDay.getMonth() - 1].slice(
                //     0,
                //     3
                //   )},${startDay.getDate()}`,
                // };

                // if (dailyCount.length) {
                //   for (let i = 0; i < dailyCount.length; i++) {
                //     obj[fields[i]] = dailyCount[i]._count.createdAt;
                //   }
                // } else {
                //   obj['pv'] = 0;
                // }
                data.push(dailyCount);
                obj = {
                  name: `${monthNames[startDay.getMonth() - 1].slice(
                    0,
                    3
                  )},${startDay.getDate()}`,
                };
                viewsCounts.push(obj);
              }
              indexOfBiggestArray = data.reduce(
                (maxIndex: any, currentArray: any, currentIndex: any) => {
                  if (currentArray.length > data[maxIndex].length) {
                    return currentIndex;
                  }
                  return maxIndex;
                },
                0
              );
              data.map((dataArray: any, idx: number) => {
                const obj: any = viewsCounts[idx]; // You can replace 'some_hour' with your actual value
                const fieldCount = data[indexOfBiggestArray].length || 1; // Ensure there's at least 1 field (e.g., 'pv')

                fields.slice(0, fieldCount).forEach((field, index) => {
                  viewsCounts[idx][field] = dataArray[index]
                    ? dataArray[index]._count.createdAt
                    : 0;
                });

                return obj;
              });
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

                const dailyCount = await prisma.pageView.groupBy({
                  by: ['device'],
                  _count: {
                    createdAt: true,
                  },
                  where,
                });

                // let obj: {
                //   name: string;
                // } & Record<string, any> = {
                //   name: `${
                //     thirtyDaysAgo.getMonth() + 1
                //   }/${thirtyDaysAgo.getDate()}`,
                // };

                // if (dailyCount.length) {
                //   for (let i = 0; i < dailyCount.length; i++) {
                //     obj[fields[i]] = dailyCount[i]._count.createdAt;
                //   }
                // } else {
                //   obj['pv'] = 0;
                // }
                // viewsCounts.push(obj);
                data.push(dailyCount);
                obj = {
                  name: `${
                    thirtyDaysAgo.getMonth() + 1
                  }/${thirtyDaysAgo.getDate()}`,
                };
                viewsCounts.push(obj);

                // Move to the previous day
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() + 1);
              }
              indexOfBiggestArray = data.reduce(
                (maxIndex: any, currentArray: any, currentIndex: any) => {
                  if (currentArray.length > data[maxIndex].length) {
                    return currentIndex;
                  }
                  return maxIndex;
                },
                0
              );
              data.map((dataArray: any, idx: number) => {
                const obj: any = viewsCounts[idx]; // You can replace 'some_hour' with your actual value
                const fieldCount = data[indexOfBiggestArray].length || 1; // Ensure there's at least 1 field (e.g., 'pv')

                fields.slice(0, fieldCount).forEach((field, index) => {
                  viewsCounts[idx][field] = dataArray[index]
                    ? dataArray[index]._count.createdAt
                    : 0;
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

                const dailyCount = await prisma.pageView.groupBy({
                  by: ['device'],
                  _count: {
                    createdAt: true,
                  },
                  where,
                });

                // let obj: {
                //   name: string;
                // } & Record<string, any> = {
                //   name: `${startDay.getMonth() + 1},${day}`,
                // };

                // if (dailyCount.length) {
                //   for (let i = 0; i < dailyCount.length; i++) {
                //     obj[fields[i]] = dailyCount[i]._count.createdAt;
                //   }
                // } else {
                //   obj['pv'] = 0;
                // }
                // viewsCounts.push(obj);

                data.push(dailyCount);
                obj = {
                  name: `${startDay.getMonth() + 1},${day}`,
                };
                viewsCounts.push(obj);
              }
              indexOfBiggestArray = data.reduce(
                (maxIndex: any, currentArray: any, currentIndex: any) => {
                  if (currentArray.length > data[maxIndex].length) {
                    return currentIndex;
                  }
                  return maxIndex;
                },
                0
              );
              data.map((dataArray: any, idx: number) => {
                const obj: any = viewsCounts[idx]; // You can replace 'some_hour' with your actual value
                const fieldCount = data[indexOfBiggestArray].length || 1; // Ensure there's at least 1 field (e.g., 'pv')

                fields.slice(0, fieldCount).forEach((field, index) => {
                  viewsCounts[idx][field] = dataArray[index]
                    ? dataArray[index]._count.createdAt
                    : 0;
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

                const dailyCount = await prisma.pageView.groupBy({
                  by: ['device'],
                  _count: {
                    createdAt: true,
                  },
                  where,
                });

                // let obj: {
                //   name: string;
                // } & Record<string, any> = {
                //   name: `${startDay.getMonth() + 1},${day}`,
                // };

                // if (dailyCount.length) {
                //   for (let i = 0; i < dailyCount.length; i++) {
                //     obj[fields[i]] = dailyCount[i]._count.createdAt;
                //   }
                // } else {
                //   obj['pv'] = 0;
                // }
                // viewsCounts.push(obj);
                data.push(dailyCount);
                obj = {
                  name: `${startDay.getMonth() + 1},${day}`,
                };
                viewsCounts.push(obj);
              }

              indexOfBiggestArray = data.reduce(
                (maxIndex: any, currentArray: any, currentIndex: any) => {
                  if (currentArray.length > data[maxIndex].length) {
                    return currentIndex;
                  }
                  return maxIndex;
                },
                0
              );
              data.map((dataArray: any, idx: number) => {
                const obj: any = viewsCounts[idx]; // You can replace 'some_hour' with your actual value
                const fieldCount = data[indexOfBiggestArray].length || 1; // Ensure there's at least 1 field (e.g., 'pv')

                fields.slice(0, fieldCount).forEach((field, index) => {
                  viewsCounts[idx][field] = dataArray[index]
                    ? dataArray[index]._count.createdAt
                    : 0;
                });
              });

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

                const dailyCount = await prisma.pageView.groupBy({
                  by: ['device'],
                  _count: {
                    createdAt: true,
                  },
                  where,
                });

                // let obj: {
                //   name: string;
                // } & Record<string, any> = {
                //   name: monthNames[month - 1].slice(0, 3),
                // };

                // if (dailyCount.length) {
                //   for (let i = 0; i < dailyCount.length; i++) {
                //     obj[fields[i]] = dailyCount[i]._count.createdAt;
                //   }
                // } else {
                //   obj['pv'] = 0;
                // }
                // viewsCounts.push(obj);

                data.push(dailyCount);
                obj = {
                  name: monthNames[month - 1].slice(0, 3),
                };
                viewsCounts.push(obj);
              }

              indexOfBiggestArray = data.reduce(
                (maxIndex: any, currentArray: any, currentIndex: any) => {
                  if (currentArray.length > data[maxIndex].length) {
                    return currentIndex;
                  }
                  return maxIndex;
                },
                0
              );
              data.map((dataArray: any, idx: number) => {
                const obj: any = viewsCounts[idx]; // You can replace 'some_hour' with your actual value
                const fieldCount = data[indexOfBiggestArray].length || 1; // Ensure there's at least 1 field (e.g., 'pv')

                fields.slice(0, fieldCount).forEach((field, index) => {
                  viewsCounts[idx][field] = dataArray[index]
                    ? dataArray[index]._count.createdAt
                    : 0;
                });
              });

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

                const dailyCount = await prisma.pageView.groupBy({
                  by: ['device'],
                  _count: {
                    createdAt: true,
                  },
                  where,
                });

                // let obj: {
                //   name: string;
                // } & Record<string, any> = {
                //   name: monthNames[month].slice(0, 3),
                // };

                // if (dailyCount.length) {
                //   for (let i = 0; i < dailyCount.length; i++) {
                //     obj[fields[i]] = dailyCount[i]._count.createdAt;
                //   }
                // } else {
                //   obj['pv'] = 0;
                // }
                // viewsCounts.push(obj);
                data.push(dailyCount);
                obj = {
                  name: monthNames[month].slice(0, 3),
                };
                viewsCounts.push(obj);
              }

              indexOfBiggestArray = data.reduce(
                (maxIndex: any, currentArray: any, currentIndex: any) => {
                  if (currentArray.length > data[maxIndex].length) {
                    return currentIndex;
                  }
                  return maxIndex;
                },
                0
              );
              data.map((dataArray: any, idx: number) => {
                const obj: any = viewsCounts[idx]; // You can replace 'some_hour' with your actual value
                const fieldCount = data[indexOfBiggestArray].length || 1; // Ensure there's at least 1 field (e.g., 'pv')

                fields.slice(0, fieldCount).forEach((field, index) => {
                  viewsCounts[idx][field] = dataArray[index]
                    ? dataArray[index]._count.createdAt
                    : 0;
                });
              });
              break;
          }

          return viewsCounts || [];
        } catch (error: any) {
          console.log(error);
          throw error;
        }
      }),
    list: adminProcedure
      .input(
        z.object({
          // username: z.string(),
          range: z.string(),
        })
      )
      .query(async ({ input }) => {
        // if (!input?.username) return [];
        const { range } = input;

        const limit = 20;

        let where: {
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

              totalViews = await prisma.pageView.count({
                where,
              });
              totalCount = await prisma.pageView.groupBy({
                by: ['device'],
                _count: {
                  createdAt: true,
                },
                where,
              });

              totalCount.map((hc) => {
                viewsCounts.push({
                  name: hc.device,
                  count: hc._count.createdAt,
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

              totalViews = await prisma.pageView.count({
                where,
              });

              totalCount = await prisma.pageView.groupBy({
                by: ['device'],
                _count: {
                  createdAt: true,
                },
                where,
              });

              totalCount.map((hc) => {
                viewsCounts.push({
                  name: hc.device,
                  count: hc._count.createdAt,
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

              totalViews = await prisma.pageView.count({
                where,
              });

              totalCount = await prisma.pageView.groupBy({
                by: ['device'],
                _count: {
                  createdAt: true,
                },
                where,
              });

              totalCount.map((hc) => {
                viewsCounts.push({
                  name: hc.device,
                  count: hc._count.createdAt,
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

              totalViews = await prisma.pageView.count({
                where,
              });

              totalCount = await prisma.pageView.groupBy({
                by: ['device'],
                _count: {
                  createdAt: true,
                },
                where,
              });

              if (totalCount.length > limit) {
                const nextItem = totalCount.pop();
              }

              totalCount.map((hc) => {
                viewsCounts.push({
                  name: hc.device,
                  count: hc._count.createdAt,
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

              totalViews = await prisma.pageView.count({
                where,
              });

              totalCount = await prisma.pageView.groupBy({
                by: ['device'],
                _count: {
                  createdAt: true,
                },
                where,
              });

              totalCount.map((hc) => {
                viewsCounts.push({
                  name: hc.device,
                  count: hc._count.createdAt,
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

              totalViews = await prisma.pageView.count({
                where,
              });

              totalCount = await prisma.pageView.groupBy({
                by: ['device'],
                _count: {
                  createdAt: true,
                },
                where,
              });

              totalCount.map((hc) => {
                viewsCounts.push({
                  name: hc.device,
                  count: hc._count.createdAt,
                });
              });

              break;
            case 'current-year':
              // Loop through each month of the year
              // Get the first and last day of the current month
              const firstDayOfMonth = new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate()
              );
              const lastDayOfMonth = new Date(
                today.getFullYear() + 1,
                today.getMonth(),
                today.getDate()
              ); // Last day of the month at 23:59:59.999

              where = {
                createdAt: {
                  gte: firstDayOfMonth,
                  lte: lastDayOfMonth,
                },
              };

              // Calculate the user count for the current month
              totalViews = await prisma.pageView.count({
                where,
              });

              totalCount = await prisma.pageView.groupBy({
                by: ['device'],
                _count: {
                  createdAt: true,
                },
                where,
              });

              totalCount.map((hc) => {
                viewsCounts.push({
                  name: hc.device,
                  count: hc._count.createdAt,
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

              totalViews = await prisma.pageView.count({
                where,
              });

              totalCount = await prisma.pageView.groupBy({
                by: ['device'],
                _count: {
                  createdAt: true,
                },
                where,
              });

              totalCount.map((hc) => {
                viewsCounts.push({
                  name: hc.device,
                  count: hc._count.createdAt,
                });
              });

              break;
          }

          return (
            {
              devicesViews: viewsCounts || [],
              totalViews: totalViews || 0,
            } || {}
          );
        } catch (error: any) {
          console.log(error);
          throw error;
        }
      }),
  }),
  os: router({
    growth: adminProcedure
      .input(
        z.object({
          // username: z.string(),
          range: z.string(),
        })
      )
      .query(async ({ input }) => {
        // if (!input?.username) return [];
        const { range } = input;
        const fields = ['pv', 'uv', 'hv'];
        let indexOfBiggestArray: number = 0;

        try {
          const today = new Date();

          // Initialize an array to store the results
          let viewsCounts: any = [];
          let where: {
            createdAt?: {
              gte: Date;
              lte: Date;
            };
          } = {};

          let data: any = [],
            obj: {
              name?: string;
            } & Record<string, any> = {};
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

                const hourlyCount = await prisma.pageView.groupBy({
                  by: ['platform'],
                  _count: {
                    createdAt: true,
                  },
                  where,
                });

                data.push(hourlyCount);
                obj = {
                  name: hourNames[`${hour}`],
                };
                viewsCounts.push(obj);

                // if (hourlyCount.length) {
                //   for (let i = 0; i < hourlyCount.length; i++) {
                //     obj[fields[i]] = hourlyCount[i]._count.createdAt;
                //   }
                // } else {
                //   obj['pv'] = 0;
                //   obj['uv'] = 0;
                // }
              }
              indexOfBiggestArray = data.reduce(
                (maxIndex: any, currentArray: any, currentIndex: any) => {
                  if (currentArray.length > data[maxIndex].length) {
                    return currentIndex;
                  }
                  return maxIndex;
                },
                0
              );
              data.map((dataArray: any, idx: number) => {
                const obj: any = viewsCounts[idx]; // You can replace 'some_hour' with your actual value
                const fieldCount = data[indexOfBiggestArray].length || 1; // Ensure there's at least 1 field (e.g., 'pv')

                fields.slice(0, fieldCount).forEach((field, index) => {
                  viewsCounts[idx][field] = dataArray[index]
                    ? dataArray[index]._count.createdAt
                    : 0;
                });

                return obj;
              });
              // console.log(result);
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

                const hourlyCount = await prisma.pageView.groupBy({
                  by: ['platform'],
                  _count: {
                    createdAt: true,
                  },
                  where,
                });

                data.push(hourlyCount);
                obj = {
                  name: hourNames[`${hour}`],
                };
                viewsCounts.push(obj);
                // let obj: {
                //   name: string;
                // } & Record<string, any> = {
                //   name: hourNames[`${hour}`],
                // };

                // if (hourlyCount.length) {
                //   for (let i = 0; i < hourlyCount.length; i++) {
                //     obj[fields[i]] = hourlyCount[i]._count.createdAt;
                //   }
                // } else {
                //   obj['pv'] = 0;
                // }
                // viewsCounts.push(obj);
              }
              indexOfBiggestArray = data.reduce(
                (maxIndex: any, currentArray: any, currentIndex: any) => {
                  if (currentArray.length > data[maxIndex].length) {
                    return currentIndex;
                  }
                  return maxIndex;
                },
                0
              );
              data.map((dataArray: any, idx: number) => {
                const obj: any = viewsCounts[idx]; // You can replace 'some_hour' with your actual value
                const fieldCount = data[indexOfBiggestArray].length || 1; // Ensure there's at least 1 field (e.g., 'pv')

                fields.slice(0, fieldCount).forEach((field, index) => {
                  viewsCounts[idx][field] = dataArray[index]
                    ? dataArray[index]._count.createdAt
                    : 0;
                });
              });
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

                const dailyCount = await prisma.pageView.groupBy({
                  by: ['platform'],
                  _count: {
                    createdAt: true,
                  },
                  where,
                });

                // let obj: {
                //   name: string;
                // } & Record<string, any> = {
                //   name: `${monthNames[startDay.getMonth() - 1].slice(
                //     0,
                //     3
                //   )},${startDay.getDate()}`,
                // };

                // if (dailyCount.length) {
                //   for (let i = 0; i < dailyCount.length; i++) {
                //     obj[fields[i]] = dailyCount[i]._count.createdAt;
                //   }
                // } else {
                //   obj['pv'] = 0;
                // }
                data.push(dailyCount);
                obj = {
                  name: `${monthNames[startDay.getMonth() - 1].slice(
                    0,
                    3
                  )},${startDay.getDate()}`,
                };
                viewsCounts.push(obj);
              }
              indexOfBiggestArray = data.reduce(
                (maxIndex: any, currentArray: any, currentIndex: any) => {
                  if (currentArray.length > data[maxIndex].length) {
                    return currentIndex;
                  }
                  return maxIndex;
                },
                0
              );
              data.map((dataArray: any, idx: number) => {
                const obj: any = viewsCounts[idx]; // You can replace 'some_hour' with your actual value
                const fieldCount = data[indexOfBiggestArray].length || 1; // Ensure there's at least 1 field (e.g., 'pv')

                fields.slice(0, fieldCount).forEach((field, index) => {
                  viewsCounts[idx][field] = dataArray[index]
                    ? dataArray[index]._count.createdAt
                    : 0;
                });

                return obj;
              });
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

                const dailyCount = await prisma.pageView.groupBy({
                  by: ['platform'],
                  _count: {
                    createdAt: true,
                  },
                  where,
                });

                // let obj: {
                //   name: string;
                // } & Record<string, any> = {
                //   name: `${
                //     thirtyDaysAgo.getMonth() + 1
                //   }/${thirtyDaysAgo.getDate()}`,
                // };

                // if (dailyCount.length) {
                //   for (let i = 0; i < dailyCount.length; i++) {
                //     obj[fields[i]] = dailyCount[i]._count.createdAt;
                //   }
                // } else {
                //   obj['pv'] = 0;
                // }
                // viewsCounts.push(obj);
                data.push(dailyCount);
                obj = {
                  name: `${
                    thirtyDaysAgo.getMonth() + 1
                  }/${thirtyDaysAgo.getDate()}`,
                };
                viewsCounts.push(obj);

                // Move to the previous day
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() + 1);
              }
              indexOfBiggestArray = data.reduce(
                (maxIndex: any, currentArray: any, currentIndex: any) => {
                  if (currentArray.length > data[maxIndex].length) {
                    return currentIndex;
                  }
                  return maxIndex;
                },
                0
              );
              data.map((dataArray: any, idx: number) => {
                const obj: any = viewsCounts[idx]; // You can replace 'some_hour' with your actual value
                const fieldCount = data[indexOfBiggestArray].length || 1; // Ensure there's at least 1 field (e.g., 'pv')

                fields.slice(0, fieldCount).forEach((field, index) => {
                  viewsCounts[idx][field] = dataArray[index]
                    ? dataArray[index]._count.createdAt
                    : 0;
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

                const dailyCount = await prisma.pageView.groupBy({
                  by: ['platform'],
                  _count: {
                    createdAt: true,
                  },
                  where,
                });

                // let obj: {
                //   name: string;
                // } & Record<string, any> = {
                //   name: `${startDay.getMonth() + 1},${day}`,
                // };

                // if (dailyCount.length) {
                //   for (let i = 0; i < dailyCount.length; i++) {
                //     obj[fields[i]] = dailyCount[i]._count.createdAt;
                //   }
                // } else {
                //   obj['pv'] = 0;
                // }
                // viewsCounts.push(obj);

                data.push(dailyCount);
                obj = {
                  name: `${startDay.getMonth() + 1},${day}`,
                };
                viewsCounts.push(obj);
              }
              indexOfBiggestArray = data.reduce(
                (maxIndex: any, currentArray: any, currentIndex: any) => {
                  if (currentArray.length > data[maxIndex].length) {
                    return currentIndex;
                  }
                  return maxIndex;
                },
                0
              );
              data.map((dataArray: any, idx: number) => {
                const obj: any = viewsCounts[idx]; // You can replace 'some_hour' with your actual value
                const fieldCount = data[indexOfBiggestArray].length || 1; // Ensure there's at least 1 field (e.g., 'pv')

                fields.slice(0, fieldCount).forEach((field, index) => {
                  viewsCounts[idx][field] = dataArray[index]
                    ? dataArray[index]._count.createdAt
                    : 0;
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

                const dailyCount = await prisma.pageView.groupBy({
                  by: ['platform'],
                  _count: {
                    createdAt: true,
                  },
                  where,
                });

                // let obj: {
                //   name: string;
                // } & Record<string, any> = {
                //   name: `${startDay.getMonth() + 1},${day}`,
                // };

                // if (dailyCount.length) {
                //   for (let i = 0; i < dailyCount.length; i++) {
                //     obj[fields[i]] = dailyCount[i]._count.createdAt;
                //   }
                // } else {
                //   obj['pv'] = 0;
                // }
                // viewsCounts.push(obj);
                data.push(dailyCount);
                obj = {
                  name: `${startDay.getMonth() + 1},${day}`,
                };
                viewsCounts.push(obj);
              }

              indexOfBiggestArray = data.reduce(
                (maxIndex: any, currentArray: any, currentIndex: any) => {
                  if (currentArray.length > data[maxIndex].length) {
                    return currentIndex;
                  }
                  return maxIndex;
                },
                0
              );
              data.map((dataArray: any, idx: number) => {
                const obj: any = viewsCounts[idx]; // You can replace 'some_hour' with your actual value
                const fieldCount = data[indexOfBiggestArray].length || 1; // Ensure there's at least 1 field (e.g., 'pv')

                fields.slice(0, fieldCount).forEach((field, index) => {
                  viewsCounts[idx][field] = dataArray[index]
                    ? dataArray[index]._count.createdAt
                    : 0;
                });
              });

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

                const dailyCount = await prisma.pageView.groupBy({
                  by: ['platform'],
                  _count: {
                    createdAt: true,
                  },
                  where,
                });

                // let obj: {
                //   name: string;
                // } & Record<string, any> = {
                //   name: monthNames[month - 1].slice(0, 3),
                // };

                // if (dailyCount.length) {
                //   for (let i = 0; i < dailyCount.length; i++) {
                //     obj[fields[i]] = dailyCount[i]._count.createdAt;
                //   }
                // } else {
                //   obj['pv'] = 0;
                // }
                // viewsCounts.push(obj);

                data.push(dailyCount);
                obj = {
                  name: monthNames[month - 1].slice(0, 3),
                };
                viewsCounts.push(obj);
              }

              indexOfBiggestArray = data.reduce(
                (maxIndex: any, currentArray: any, currentIndex: any) => {
                  if (currentArray.length > data[maxIndex].length) {
                    return currentIndex;
                  }
                  return maxIndex;
                },
                0
              );
              data.map((dataArray: any, idx: number) => {
                const obj: any = viewsCounts[idx]; // You can replace 'some_hour' with your actual value
                const fieldCount = data[indexOfBiggestArray].length || 1; // Ensure there's at least 1 field (e.g., 'pv')

                fields.slice(0, fieldCount).forEach((field, index) => {
                  viewsCounts[idx][field] = dataArray[index]
                    ? dataArray[index]._count.createdAt
                    : 0;
                });
              });

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

                const dailyCount = await prisma.pageView.groupBy({
                  by: ['platform'],
                  _count: {
                    createdAt: true,
                  },
                  where,
                });

                // let obj: {
                //   name: string;
                // } & Record<string, any> = {
                //   name: monthNames[month].slice(0, 3),
                // };

                // if (dailyCount.length) {
                //   for (let i = 0; i < dailyCount.length; i++) {
                //     obj[fields[i]] = dailyCount[i]._count.createdAt;
                //   }
                // } else {
                //   obj['pv'] = 0;
                // }
                // viewsCounts.push(obj);
                data.push(dailyCount);
                obj = {
                  name: monthNames[month].slice(0, 3),
                };
                viewsCounts.push(obj);
              }

              indexOfBiggestArray = data.reduce(
                (maxIndex: any, currentArray: any, currentIndex: any) => {
                  if (currentArray.length > data[maxIndex].length) {
                    return currentIndex;
                  }
                  return maxIndex;
                },
                0
              );
              data.map((dataArray: any, idx: number) => {
                const obj: any = viewsCounts[idx]; // You can replace 'some_hour' with your actual value
                const fieldCount = data[indexOfBiggestArray].length || 1; // Ensure there's at least 1 field (e.g., 'pv')

                fields.slice(0, fieldCount).forEach((field, index) => {
                  viewsCounts[idx][field] = dataArray[index]
                    ? dataArray[index]._count.createdAt
                    : 0;
                });
              });
              break;
          }

          return viewsCounts || [];
        } catch (error: any) {
          console.log(error);
          throw error;
        }
      }),
    list: adminProcedure
      .input(
        z.object({
          // username: z.string(),
          range: z.string(),
        })
      )
      .query(async ({ input }) => {
        // if (!input?.username) return [];
        const { range } = input;

        const limit = 20;

        let where: {
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

              totalViews = await prisma.pageView.count({
                where,
              });
              totalCount = await prisma.pageView.groupBy({
                by: ['platform'],
                _count: {
                  createdAt: true,
                },
                where,
              });

              totalCount.map((hc) => {
                viewsCounts.push({
                  name: hc.platform,
                  count: hc._count.createdAt,
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

              totalViews = await prisma.pageView.count({
                where,
              });

              totalCount = await prisma.pageView.groupBy({
                by: ['platform'],
                _count: {
                  createdAt: true,
                },
                where,
              });

              totalCount.map((hc) => {
                viewsCounts.push({
                  name: hc.platform,
                  count: hc._count.createdAt,
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

              totalViews = await prisma.pageView.count({
                where,
              });

              totalCount = await prisma.pageView.groupBy({
                by: ['platform'],
                _count: {
                  createdAt: true,
                },
                where,
              });

              totalCount.map((hc) => {
                viewsCounts.push({
                  name: hc.platform,
                  count: hc._count.createdAt,
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

              totalViews = await prisma.pageView.count({
                where,
              });

              totalCount = await prisma.pageView.groupBy({
                by: ['platform'],
                _count: {
                  createdAt: true,
                },
                where,
              });

              if (totalCount.length > limit) {
                const nextItem = totalCount.pop();
              }

              totalCount.map((hc) => {
                viewsCounts.push({
                  name: hc.platform,
                  count: hc._count.createdAt,
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

              totalViews = await prisma.pageView.count({
                where,
              });

              totalCount = await prisma.pageView.groupBy({
                by: ['platform'],
                _count: {
                  createdAt: true,
                },
                where,
              });

              totalCount.map((hc) => {
                viewsCounts.push({
                  name: hc.platform,
                  count: hc._count.createdAt,
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

              totalViews = await prisma.pageView.count({
                where,
              });

              totalCount = await prisma.pageView.groupBy({
                by: ['platform'],
                _count: {
                  createdAt: true,
                },
                where,
              });

              totalCount.map((hc) => {
                viewsCounts.push({
                  name: hc.platform,
                  count: hc._count.createdAt,
                });
              });

              break;
            case 'current-year':
              // Loop through each month of the year
              // Get the first and last day of the current month
              const firstDayOfMonth = new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate()
              );
              const lastDayOfMonth = new Date(
                today.getFullYear() + 1,
                today.getMonth(),
                today.getDate()
              ); // Last day of the month at 23:59:59.999

              where = {
                createdAt: {
                  gte: firstDayOfMonth,
                  lte: lastDayOfMonth,
                },
              };

              // Calculate the user count for the current month
              totalViews = await prisma.pageView.count({
                where,
              });

              totalCount = await prisma.pageView.groupBy({
                by: ['platform'],
                _count: {
                  createdAt: true,
                },
                where,
              });

              totalCount.map((hc) => {
                viewsCounts.push({
                  name: hc.platform,
                  count: hc._count.createdAt,
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

              totalViews = await prisma.pageView.count({
                where,
              });

              totalCount = await prisma.pageView.groupBy({
                by: ['platform'],
                _count: {
                  createdAt: true,
                },
                where,
              });

              totalCount.map((hc) => {
                viewsCounts.push({
                  name: hc.platform,
                  count: hc._count.createdAt,
                });
              });

              break;
          }

          return (
            {
              devicesViews: viewsCounts || [],
              totalViews: totalViews || 0,
            } || {}
          );
        } catch (error: any) {
          console.log(error);
          throw error;
        }
      }),
  }),
  browser: router({
    growth: adminProcedure
      .input(
        z.object({
          // username: z.string(),
          range: z.string(),
        })
      )
      .query(async ({ input }) => {
        // if (!input?.username) return [];
        const { range } = input;
        const fields = ['pv', 'uv', 'hv'];
        let indexOfBiggestArray: number = 0;

        try {
          const today = new Date();

          // Initialize an array to store the results
          let viewsCounts: any = [];
          let where: {
            createdAt?: {
              gte: Date;
              lte: Date;
            };
          } = {};

          let data: any = [],
            obj: {
              name?: string;
            } & Record<string, any> = {};
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

                const hourlyCount = await prisma.pageView.groupBy({
                  by: ['browser'],
                  _count: {
                    createdAt: true,
                  },
                  where,
                });

                data.push(hourlyCount);
                obj = {
                  name: hourNames[`${hour}`],
                };
                viewsCounts.push(obj);

                // if (hourlyCount.length) {
                //   for (let i = 0; i < hourlyCount.length; i++) {
                //     obj[fields[i]] = hourlyCount[i]._count.createdAt;
                //   }
                // } else {
                //   obj['pv'] = 0;
                //   obj['uv'] = 0;
                // }
              }
              indexOfBiggestArray = data.reduce(
                (maxIndex: any, currentArray: any, currentIndex: any) => {
                  if (currentArray.length > data[maxIndex].length) {
                    return currentIndex;
                  }
                  return maxIndex;
                },
                0
              );
              data.map((dataArray: any, idx: number) => {
                const obj: any = viewsCounts[idx]; // You can replace 'some_hour' with your actual value
                const fieldCount = data[indexOfBiggestArray].length || 1; // Ensure there's at least 1 field (e.g., 'pv')

                fields.slice(0, fieldCount).forEach((field, index) => {
                  viewsCounts[idx][field] = dataArray[index]
                    ? dataArray[index]._count.createdAt
                    : 0;
                });

                return obj;
              });
              // console.log(result);
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

                const hourlyCount = await prisma.pageView.groupBy({
                  by: ['browser'],
                  _count: {
                    createdAt: true,
                  },
                  where,
                });

                data.push(hourlyCount);
                obj = {
                  name: hourNames[`${hour}`],
                };
                viewsCounts.push(obj);
                // let obj: {
                //   name: string;
                // } & Record<string, any> = {
                //   name: hourNames[`${hour}`],
                // };

                // if (hourlyCount.length) {
                //   for (let i = 0; i < hourlyCount.length; i++) {
                //     obj[fields[i]] = hourlyCount[i]._count.createdAt;
                //   }
                // } else {
                //   obj['pv'] = 0;
                // }
                // viewsCounts.push(obj);
              }
              indexOfBiggestArray = data.reduce(
                (maxIndex: any, currentArray: any, currentIndex: any) => {
                  if (currentArray.length > data[maxIndex].length) {
                    return currentIndex;
                  }
                  return maxIndex;
                },
                0
              );
              data.map((dataArray: any, idx: number) => {
                const obj: any = viewsCounts[idx]; // You can replace 'some_hour' with your actual value
                const fieldCount = data[indexOfBiggestArray].length || 1; // Ensure there's at least 1 field (e.g., 'pv')

                fields.slice(0, fieldCount).forEach((field, index) => {
                  viewsCounts[idx][field] = dataArray[index]
                    ? dataArray[index]._count.createdAt
                    : 0;
                });
              });
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

                const dailyCount = await prisma.pageView.groupBy({
                  by: ['browser'],
                  _count: {
                    createdAt: true,
                  },
                  where,
                });

                // let obj: {
                //   name: string;
                // } & Record<string, any> = {
                //   name: `${monthNames[startDay.getMonth() - 1].slice(
                //     0,
                //     3
                //   )},${startDay.getDate()}`,
                // };

                // if (dailyCount.length) {
                //   for (let i = 0; i < dailyCount.length; i++) {
                //     obj[fields[i]] = dailyCount[i]._count.createdAt;
                //   }
                // } else {
                //   obj['pv'] = 0;
                // }
                data.push(dailyCount);
                obj = {
                  name: `${monthNames[startDay.getMonth() - 1].slice(
                    0,
                    3
                  )},${startDay.getDate()}`,
                };
                viewsCounts.push(obj);
              }
              indexOfBiggestArray = data.reduce(
                (maxIndex: any, currentArray: any, currentIndex: any) => {
                  if (currentArray.length > data[maxIndex].length) {
                    return currentIndex;
                  }
                  return maxIndex;
                },
                0
              );
              data.map((dataArray: any, idx: number) => {
                const obj: any = viewsCounts[idx]; // You can replace 'some_hour' with your actual value
                const fieldCount = data[indexOfBiggestArray].length || 1; // Ensure there's at least 1 field (e.g., 'pv')

                fields.slice(0, fieldCount).forEach((field, index) => {
                  viewsCounts[idx][field] = dataArray[index]
                    ? dataArray[index]._count.createdAt
                    : 0;
                });

                return obj;
              });
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

                const dailyCount = await prisma.pageView.groupBy({
                  by: ['browser'],
                  _count: {
                    createdAt: true,
                  },
                  where,
                });

                // let obj: {
                //   name: string;
                // } & Record<string, any> = {
                //   name: `${
                //     thirtyDaysAgo.getMonth() + 1
                //   }/${thirtyDaysAgo.getDate()}`,
                // };

                // if (dailyCount.length) {
                //   for (let i = 0; i < dailyCount.length; i++) {
                //     obj[fields[i]] = dailyCount[i]._count.createdAt;
                //   }
                // } else {
                //   obj['pv'] = 0;
                // }
                // viewsCounts.push(obj);
                data.push(dailyCount);
                obj = {
                  name: `${
                    thirtyDaysAgo.getMonth() + 1
                  }/${thirtyDaysAgo.getDate()}`,
                };
                viewsCounts.push(obj);

                // Move to the previous day
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() + 1);
              }
              indexOfBiggestArray = data.reduce(
                (maxIndex: any, currentArray: any, currentIndex: any) => {
                  if (currentArray.length > data[maxIndex].length) {
                    return currentIndex;
                  }
                  return maxIndex;
                },
                0
              );
              data.map((dataArray: any, idx: number) => {
                const obj: any = viewsCounts[idx]; // You can replace 'some_hour' with your actual value
                const fieldCount = data[indexOfBiggestArray].length || 1; // Ensure there's at least 1 field (e.g., 'pv')

                fields.slice(0, fieldCount).forEach((field, index) => {
                  viewsCounts[idx][field] = dataArray[index]
                    ? dataArray[index]._count.createdAt
                    : 0;
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

                const dailyCount = await prisma.pageView.groupBy({
                  by: ['browser'],
                  _count: {
                    createdAt: true,
                  },
                  where,
                });

                // let obj: {
                //   name: string;
                // } & Record<string, any> = {
                //   name: `${startDay.getMonth() + 1},${day}`,
                // };

                // if (dailyCount.length) {
                //   for (let i = 0; i < dailyCount.length; i++) {
                //     obj[fields[i]] = dailyCount[i]._count.createdAt;
                //   }
                // } else {
                //   obj['pv'] = 0;
                // }
                // viewsCounts.push(obj);

                data.push(dailyCount);
                obj = {
                  name: `${startDay.getMonth() + 1},${day}`,
                };
                viewsCounts.push(obj);
              }
              indexOfBiggestArray = data.reduce(
                (maxIndex: any, currentArray: any, currentIndex: any) => {
                  if (currentArray.length > data[maxIndex].length) {
                    return currentIndex;
                  }
                  return maxIndex;
                },
                0
              );
              data.map((dataArray: any, idx: number) => {
                const obj: any = viewsCounts[idx]; // You can replace 'some_hour' with your actual value
                const fieldCount = data[indexOfBiggestArray].length || 1; // Ensure there's at least 1 field (e.g., 'pv')

                fields.slice(0, fieldCount).forEach((field, index) => {
                  viewsCounts[idx][field] = dataArray[index]
                    ? dataArray[index]._count.createdAt
                    : 0;
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

                const dailyCount = await prisma.pageView.groupBy({
                  by: ['browser'],
                  _count: {
                    createdAt: true,
                  },
                  where,
                });

                // let obj: {
                //   name: string;
                // } & Record<string, any> = {
                //   name: `${startDay.getMonth() + 1},${day}`,
                // };

                // if (dailyCount.length) {
                //   for (let i = 0; i < dailyCount.length; i++) {
                //     obj[fields[i]] = dailyCount[i]._count.createdAt;
                //   }
                // } else {
                //   obj['pv'] = 0;
                // }
                // viewsCounts.push(obj);
                data.push(dailyCount);
                obj = {
                  name: `${startDay.getMonth() + 1},${day}`,
                };
                viewsCounts.push(obj);
              }

              indexOfBiggestArray = data.reduce(
                (maxIndex: any, currentArray: any, currentIndex: any) => {
                  if (currentArray.length > data[maxIndex].length) {
                    return currentIndex;
                  }
                  return maxIndex;
                },
                0
              );
              data.map((dataArray: any, idx: number) => {
                const obj: any = viewsCounts[idx]; // You can replace 'some_hour' with your actual value
                const fieldCount = data[indexOfBiggestArray].length || 1; // Ensure there's at least 1 field (e.g., 'pv')

                fields.slice(0, fieldCount).forEach((field, index) => {
                  viewsCounts[idx][field] = dataArray[index]
                    ? dataArray[index]._count.createdAt
                    : 0;
                });
              });

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

                const dailyCount = await prisma.pageView.groupBy({
                  by: ['browser'],
                  _count: {
                    createdAt: true,
                  },
                  where,
                });

                // let obj: {
                //   name: string;
                // } & Record<string, any> = {
                //   name: monthNames[month - 1].slice(0, 3),
                // };

                // if (dailyCount.length) {
                //   for (let i = 0; i < dailyCount.length; i++) {
                //     obj[fields[i]] = dailyCount[i]._count.createdAt;
                //   }
                // } else {
                //   obj['pv'] = 0;
                // }
                // viewsCounts.push(obj);

                data.push(dailyCount);
                obj = {
                  name: monthNames[month - 1].slice(0, 3),
                };
                viewsCounts.push(obj);
              }

              indexOfBiggestArray = data.reduce(
                (maxIndex: any, currentArray: any, currentIndex: any) => {
                  if (currentArray.length > data[maxIndex].length) {
                    return currentIndex;
                  }
                  return maxIndex;
                },
                0
              );
              data.map((dataArray: any, idx: number) => {
                const obj: any = viewsCounts[idx]; // You can replace 'some_hour' with your actual value
                const fieldCount = data[indexOfBiggestArray].length || 1; // Ensure there's at least 1 field (e.g., 'pv')

                fields.slice(0, fieldCount).forEach((field, index) => {
                  viewsCounts[idx][field] = dataArray[index]
                    ? dataArray[index]._count.createdAt
                    : 0;
                });
              });

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

                const dailyCount = await prisma.pageView.groupBy({
                  by: ['browser'],
                  _count: {
                    createdAt: true,
                  },
                  where,
                });

                // let obj: {
                //   name: string;
                // } & Record<string, any> = {
                //   name: monthNames[month].slice(0, 3),
                // };

                // if (dailyCount.length) {
                //   for (let i = 0; i < dailyCount.length; i++) {
                //     obj[fields[i]] = dailyCount[i]._count.createdAt;
                //   }
                // } else {
                //   obj['pv'] = 0;
                // }
                // viewsCounts.push(obj);
                data.push(dailyCount);
                obj = {
                  name: monthNames[month].slice(0, 3),
                };
                viewsCounts.push(obj);
              }

              indexOfBiggestArray = data.reduce(
                (maxIndex: any, currentArray: any, currentIndex: any) => {
                  if (currentArray.length > data[maxIndex].length) {
                    return currentIndex;
                  }
                  return maxIndex;
                },
                0
              );
              data.map((dataArray: any, idx: number) => {
                const obj: any = viewsCounts[idx]; // You can replace 'some_hour' with your actual value
                const fieldCount = data[indexOfBiggestArray].length || 1; // Ensure there's at least 1 field (e.g., 'pv')

                fields.slice(0, fieldCount).forEach((field, index) => {
                  viewsCounts[idx][field] = dataArray[index]
                    ? dataArray[index]._count.createdAt
                    : 0;
                });
              });
              break;
          }

          return viewsCounts || [];
        } catch (error: any) {
          console.log(error);
          throw error;
        }
      }),
    list: adminProcedure
      .input(
        z.object({
          // username: z.string(),
          range: z.string(),
        })
      )
      .query(async ({ input }) => {
        // if (!input?.username) return [];
        const { range } = input;

        const limit = 20;

        let where: {
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

              totalViews = await prisma.pageView.count({
                where,
              });
              totalCount = await prisma.pageView.groupBy({
                by: ['browser'],
                _count: {
                  createdAt: true,
                },
                where,
              });

              totalCount.map((hc) => {
                viewsCounts.push({
                  name: hc.browser,
                  count: hc._count.createdAt,
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

              totalViews = await prisma.pageView.count({
                where,
              });

              totalCount = await prisma.pageView.groupBy({
                by: ['browser'],
                _count: {
                  createdAt: true,
                },
                where,
              });

              totalCount.map((hc) => {
                viewsCounts.push({
                  name: hc.browser,
                  count: hc._count.createdAt,
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

              totalViews = await prisma.pageView.count({
                where,
              });

              totalCount = await prisma.pageView.groupBy({
                by: ['browser'],
                _count: {
                  createdAt: true,
                },
                where,
              });

              totalCount.map((hc) => {
                viewsCounts.push({
                  name: hc.browser,
                  count: hc._count.createdAt,
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

              totalViews = await prisma.pageView.count({
                where,
              });

              totalCount = await prisma.pageView.groupBy({
                by: ['browser'],
                _count: {
                  createdAt: true,
                },
                where,
              });

              if (totalCount.length > limit) {
                const nextItem = totalCount.pop();
              }

              totalCount.map((hc) => {
                viewsCounts.push({
                  name: hc.browser,
                  count: hc._count.createdAt,
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

              totalViews = await prisma.pageView.count({
                where,
              });

              totalCount = await prisma.pageView.groupBy({
                by: ['browser'],
                _count: {
                  createdAt: true,
                },
                where,
              });

              totalCount.map((hc) => {
                viewsCounts.push({
                  name: hc.browser,
                  count: hc._count.createdAt,
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

              totalViews = await prisma.pageView.count({
                where,
              });

              totalCount = await prisma.pageView.groupBy({
                by: ['browser'],
                _count: {
                  createdAt: true,
                },
                where,
              });

              totalCount.map((hc) => {
                viewsCounts.push({
                  name: hc.browser,
                  count: hc._count.createdAt,
                });
              });

              break;
            case 'current-year':
              // Loop through each month of the year
              // Get the first and last day of the current month
              const firstDayOfMonth = new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate()
              );
              const lastDayOfMonth = new Date(
                today.getFullYear() + 1,
                today.getMonth(),
                today.getDate()
              ); // Last day of the month at 23:59:59.999

              where = {
                createdAt: {
                  gte: firstDayOfMonth,
                  lte: lastDayOfMonth,
                },
              };

              // Calculate the user count for the current month
              totalViews = await prisma.pageView.count({
                where,
              });

              totalCount = await prisma.pageView.groupBy({
                by: ['browser'],
                _count: {
                  createdAt: true,
                },
                where,
              });

              totalCount.map((hc) => {
                viewsCounts.push({
                  name: hc.browser,
                  count: hc._count.createdAt,
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

              totalViews = await prisma.pageView.count({
                where,
              });

              totalCount = await prisma.pageView.groupBy({
                by: ['browser'],
                _count: {
                  createdAt: true,
                },
                where,
              });

              totalCount.map((hc) => {
                viewsCounts.push({
                  name: hc.browser,
                  count: hc._count.createdAt,
                });
              });

              break;
          }

          return (
            {
              devicesViews: viewsCounts || [],
              totalViews: totalViews || 0,
            } || {}
          );
        } catch (error: any) {
          console.log(error);
          throw error;
        }
      }),
  }),
  screenSize: router({
    growth: adminProcedure
      .input(
        z.object({
          // username: z.string(),
          range: z.string(),
        })
      )
      .query(async ({ input }) => {
        // if (!input?.username) return [];
        const { range } = input;
        const fields = ['pv', 'uv', 'hv'];
        let indexOfBiggestArray: number = 0;

        try {
          const today = new Date();

          // Initialize an array to store the results
          let viewsCounts: any = [];
          let where: {
            createdAt?: {
              gte: Date;
              lte: Date;
            };
          } = {};

          let data: any = [],
            obj: {
              name?: string;
            } & Record<string, any> = {};
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

                const hourlyCount = await prisma.pageView.groupBy({
                  by: ['screenSize'],
                  _count: {
                    createdAt: true,
                  },
                  where,
                });

                data.push(hourlyCount);
                obj = {
                  name: hourNames[`${hour}`],
                };
                viewsCounts.push(obj);

                // if (hourlyCount.length) {
                //   for (let i = 0; i < hourlyCount.length; i++) {
                //     obj[fields[i]] = hourlyCount[i]._count.createdAt;
                //   }
                // } else {
                //   obj['pv'] = 0;
                //   obj['uv'] = 0;
                // }
              }
              indexOfBiggestArray = data.reduce(
                (maxIndex: any, currentArray: any, currentIndex: any) => {
                  if (currentArray.length > data[maxIndex].length) {
                    return currentIndex;
                  }
                  return maxIndex;
                },
                0
              );
              data.map((dataArray: any, idx: number) => {
                const obj: any = viewsCounts[idx]; // You can replace 'some_hour' with your actual value
                const fieldCount = data[indexOfBiggestArray].length || 1; // Ensure there's at least 1 field (e.g., 'pv')

                fields.slice(0, fieldCount).forEach((field, index) => {
                  viewsCounts[idx][field] = dataArray[index]
                    ? dataArray[index]._count.createdAt
                    : 0;
                });

                return obj;
              });
              // console.log(result);
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

                const hourlyCount = await prisma.pageView.groupBy({
                  by: ['screenSize'],
                  _count: {
                    createdAt: true,
                  },
                  where,
                });

                data.push(hourlyCount);
                obj = {
                  name: hourNames[`${hour}`],
                };
                viewsCounts.push(obj);
                // let obj: {
                //   name: string;
                // } & Record<string, any> = {
                //   name: hourNames[`${hour}`],
                // };

                // if (hourlyCount.length) {
                //   for (let i = 0; i < hourlyCount.length; i++) {
                //     obj[fields[i]] = hourlyCount[i]._count.createdAt;
                //   }
                // } else {
                //   obj['pv'] = 0;
                // }
                // viewsCounts.push(obj);
              }
              indexOfBiggestArray = data.reduce(
                (maxIndex: any, currentArray: any, currentIndex: any) => {
                  if (currentArray.length > data[maxIndex].length) {
                    return currentIndex;
                  }
                  return maxIndex;
                },
                0
              );
              data.map((dataArray: any, idx: number) => {
                const obj: any = viewsCounts[idx]; // You can replace 'some_hour' with your actual value
                const fieldCount = data[indexOfBiggestArray].length || 1; // Ensure there's at least 1 field (e.g., 'pv')

                fields.slice(0, fieldCount).forEach((field, index) => {
                  viewsCounts[idx][field] = dataArray[index]
                    ? dataArray[index]._count.createdAt
                    : 0;
                });
              });
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

                const dailyCount = await prisma.pageView.groupBy({
                  by: ['screenSize'],
                  _count: {
                    createdAt: true,
                  },
                  where,
                });

                // let obj: {
                //   name: string;
                // } & Record<string, any> = {
                //   name: `${monthNames[startDay.getMonth() - 1].slice(
                //     0,
                //     3
                //   )},${startDay.getDate()}`,
                // };

                // if (dailyCount.length) {
                //   for (let i = 0; i < dailyCount.length; i++) {
                //     obj[fields[i]] = dailyCount[i]._count.createdAt;
                //   }
                // } else {
                //   obj['pv'] = 0;
                // }
                data.push(dailyCount);
                obj = {
                  name: `${monthNames[startDay.getMonth() - 1].slice(
                    0,
                    3
                  )},${startDay.getDate()}`,
                };
                viewsCounts.push(obj);
              }
              indexOfBiggestArray = data.reduce(
                (maxIndex: any, currentArray: any, currentIndex: any) => {
                  if (currentArray.length > data[maxIndex].length) {
                    return currentIndex;
                  }
                  return maxIndex;
                },
                0
              );
              data.map((dataArray: any, idx: number) => {
                const obj: any = viewsCounts[idx]; // You can replace 'some_hour' with your actual value
                const fieldCount = data[indexOfBiggestArray].length || 1; // Ensure there's at least 1 field (e.g., 'pv')

                fields.slice(0, fieldCount).forEach((field, index) => {
                  viewsCounts[idx][field] = dataArray[index]
                    ? dataArray[index]._count.createdAt
                    : 0;
                });

                return obj;
              });
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

                const dailyCount = await prisma.pageView.groupBy({
                  by: ['screenSize'],
                  _count: {
                    createdAt: true,
                  },
                  where,
                });

                // let obj: {
                //   name: string;
                // } & Record<string, any> = {
                //   name: `${
                //     thirtyDaysAgo.getMonth() + 1
                //   }/${thirtyDaysAgo.getDate()}`,
                // };

                // if (dailyCount.length) {
                //   for (let i = 0; i < dailyCount.length; i++) {
                //     obj[fields[i]] = dailyCount[i]._count.createdAt;
                //   }
                // } else {
                //   obj['pv'] = 0;
                // }
                // viewsCounts.push(obj);
                data.push(dailyCount);
                obj = {
                  name: `${
                    thirtyDaysAgo.getMonth() + 1
                  }/${thirtyDaysAgo.getDate()}`,
                };
                viewsCounts.push(obj);

                // Move to the previous day
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() + 1);
              }
              indexOfBiggestArray = data.reduce(
                (maxIndex: any, currentArray: any, currentIndex: any) => {
                  if (currentArray.length > data[maxIndex].length) {
                    return currentIndex;
                  }
                  return maxIndex;
                },
                0
              );
              data.map((dataArray: any, idx: number) => {
                const obj: any = viewsCounts[idx]; // You can replace 'some_hour' with your actual value
                const fieldCount = data[indexOfBiggestArray].length || 1; // Ensure there's at least 1 field (e.g., 'pv')

                fields.slice(0, fieldCount).forEach((field, index) => {
                  viewsCounts[idx][field] = dataArray[index]
                    ? dataArray[index]._count.createdAt
                    : 0;
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

                const dailyCount = await prisma.pageView.groupBy({
                  by: ['screenSize'],
                  _count: {
                    createdAt: true,
                  },
                  where,
                });

                // let obj: {
                //   name: string;
                // } & Record<string, any> = {
                //   name: `${startDay.getMonth() + 1},${day}`,
                // };

                // if (dailyCount.length) {
                //   for (let i = 0; i < dailyCount.length; i++) {
                //     obj[fields[i]] = dailyCount[i]._count.createdAt;
                //   }
                // } else {
                //   obj['pv'] = 0;
                // }
                // viewsCounts.push(obj);

                data.push(dailyCount);
                obj = {
                  name: `${startDay.getMonth() + 1},${day}`,
                };
                viewsCounts.push(obj);
              }
              indexOfBiggestArray = data.reduce(
                (maxIndex: any, currentArray: any, currentIndex: any) => {
                  if (currentArray.length > data[maxIndex].length) {
                    return currentIndex;
                  }
                  return maxIndex;
                },
                0
              );
              data.map((dataArray: any, idx: number) => {
                const obj: any = viewsCounts[idx]; // You can replace 'some_hour' with your actual value
                const fieldCount = data[indexOfBiggestArray].length || 1; // Ensure there's at least 1 field (e.g., 'pv')

                fields.slice(0, fieldCount).forEach((field, index) => {
                  viewsCounts[idx][field] = dataArray[index]
                    ? dataArray[index]._count.createdAt
                    : 0;
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

                const dailyCount = await prisma.pageView.groupBy({
                  by: ['screenSize'],
                  _count: {
                    createdAt: true,
                  },
                  where,
                });

                // let obj: {
                //   name: string;
                // } & Record<string, any> = {
                //   name: `${startDay.getMonth() + 1},${day}`,
                // };

                // if (dailyCount.length) {
                //   for (let i = 0; i < dailyCount.length; i++) {
                //     obj[fields[i]] = dailyCount[i]._count.createdAt;
                //   }
                // } else {
                //   obj['pv'] = 0;
                // }
                // viewsCounts.push(obj);
                data.push(dailyCount);
                obj = {
                  name: `${startDay.getMonth() + 1},${day}`,
                };
                viewsCounts.push(obj);
              }

              indexOfBiggestArray = data.reduce(
                (maxIndex: any, currentArray: any, currentIndex: any) => {
                  if (currentArray.length > data[maxIndex].length) {
                    return currentIndex;
                  }
                  return maxIndex;
                },
                0
              );
              data.map((dataArray: any, idx: number) => {
                const obj: any = viewsCounts[idx]; // You can replace 'some_hour' with your actual value
                const fieldCount = data[indexOfBiggestArray].length || 1; // Ensure there's at least 1 field (e.g., 'pv')

                fields.slice(0, fieldCount).forEach((field, index) => {
                  viewsCounts[idx][field] = dataArray[index]
                    ? dataArray[index]._count.createdAt
                    : 0;
                });
              });

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

                const dailyCount = await prisma.pageView.groupBy({
                  by: ['screenSize'],
                  _count: {
                    createdAt: true,
                  },
                  where,
                });

                // let obj: {
                //   name: string;
                // } & Record<string, any> = {
                //   name: monthNames[month - 1].slice(0, 3),
                // };

                // if (dailyCount.length) {
                //   for (let i = 0; i < dailyCount.length; i++) {
                //     obj[fields[i]] = dailyCount[i]._count.createdAt;
                //   }
                // } else {
                //   obj['pv'] = 0;
                // }
                // viewsCounts.push(obj);

                data.push(dailyCount);
                obj = {
                  name: monthNames[month - 1].slice(0, 3),
                };
                viewsCounts.push(obj);
              }

              indexOfBiggestArray = data.reduce(
                (maxIndex: any, currentArray: any, currentIndex: any) => {
                  if (currentArray.length > data[maxIndex].length) {
                    return currentIndex;
                  }
                  return maxIndex;
                },
                0
              );
              data.map((dataArray: any, idx: number) => {
                const obj: any = viewsCounts[idx]; // You can replace 'some_hour' with your actual value
                const fieldCount = data[indexOfBiggestArray].length || 1; // Ensure there's at least 1 field (e.g., 'pv')

                fields.slice(0, fieldCount).forEach((field, index) => {
                  viewsCounts[idx][field] = dataArray[index]
                    ? dataArray[index]._count.createdAt
                    : 0;
                });
              });

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

                const dailyCount = await prisma.pageView.groupBy({
                  by: ['screenSize'],
                  _count: {
                    createdAt: true,
                  },
                  where,
                });

                // let obj: {
                //   name: string;
                // } & Record<string, any> = {
                //   name: monthNames[month].slice(0, 3),
                // };

                // if (dailyCount.length) {
                //   for (let i = 0; i < dailyCount.length; i++) {
                //     obj[fields[i]] = dailyCount[i]._count.createdAt;
                //   }
                // } else {
                //   obj['pv'] = 0;
                // }
                // viewsCounts.push(obj);
                data.push(dailyCount);
                obj = {
                  name: monthNames[month].slice(0, 3),
                };
                viewsCounts.push(obj);
              }

              indexOfBiggestArray = data.reduce(
                (maxIndex: any, currentArray: any, currentIndex: any) => {
                  if (currentArray.length > data[maxIndex].length) {
                    return currentIndex;
                  }
                  return maxIndex;
                },
                0
              );
              data.map((dataArray: any, idx: number) => {
                const obj: any = viewsCounts[idx]; // You can replace 'some_hour' with your actual value
                const fieldCount = data[indexOfBiggestArray].length || 1; // Ensure there's at least 1 field (e.g., 'pv')

                fields.slice(0, fieldCount).forEach((field, index) => {
                  viewsCounts[idx][field] = dataArray[index]
                    ? dataArray[index]._count.createdAt
                    : 0;
                });
              });
              break;
          }

          return viewsCounts || [];
        } catch (error: any) {
          console.log(error);
          throw error;
        }
      }),
    list: adminProcedure
      .input(
        z.object({
          // username: z.string(),
          range: z.string(),
        })
      )
      .query(async ({ input }) => {
        // if (!input?.username) return [];
        const { range } = input;

        const limit = 20;

        let where: {
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

              totalViews = await prisma.pageView.count({
                where,
              });
              totalCount = await prisma.pageView.groupBy({
                by: ['screenSize'],
                _count: {
                  createdAt: true,
                },
                where,
              });

              totalCount.map((hc) => {
                viewsCounts.push({
                  name: `${JSON.parse(JSON.stringify(hc.screenSize))
                    ?.width} x ${JSON.parse(JSON.stringify(hc.screenSize))
                    ?.height}`,
                  count: hc._count.createdAt,
                });
              });
              console.log(viewsCounts);

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

              totalViews = await prisma.pageView.count({
                where,
              });

              totalCount = await prisma.pageView.groupBy({
                by: ['screenSize'],
                _count: {
                  createdAt: true,
                },
                where,
              });

              totalCount.map((hc) => {
                viewsCounts.push({
                  name: `${JSON.parse(JSON.stringify(hc.screenSize))
                    ?.width} x ${JSON.parse(JSON.stringify(hc.screenSize))
                    ?.height}`,
                  count: hc._count.createdAt,
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

              totalViews = await prisma.pageView.count({
                where,
              });

              totalCount = await prisma.pageView.groupBy({
                by: ['screenSize'],
                _count: {
                  createdAt: true,
                },
                where,
              });

              totalCount.map((hc) => {
                viewsCounts.push({
                  name: `${JSON.parse(JSON.stringify(hc.screenSize))
                    ?.width} x ${JSON.parse(JSON.stringify(hc.screenSize))
                    ?.height}`,
                  count: hc._count.createdAt,
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

              totalViews = await prisma.pageView.count({
                where,
              });

              totalCount = await prisma.pageView.groupBy({
                by: ['screenSize'],
                _count: {
                  createdAt: true,
                },
                where,
              });

              if (totalCount.length > limit) {
                const nextItem = totalCount.pop();
              }

              totalCount.map((hc) => {
                viewsCounts.push({
                  name: `${JSON.parse(JSON.stringify(hc.screenSize))
                    ?.width} x ${JSON.parse(JSON.stringify(hc.screenSize))
                    ?.height}`,
                  count: hc._count.createdAt,
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

              totalViews = await prisma.pageView.count({
                where,
              });

              totalCount = await prisma.pageView.groupBy({
                by: ['screenSize'],
                _count: {
                  createdAt: true,
                },
                where,
              });

              totalCount.map((hc) => {
                viewsCounts.push({
                  name: `${JSON.parse(JSON.stringify(hc.screenSize))
                    ?.width} x ${JSON.parse(JSON.stringify(hc.screenSize))
                    ?.height}`,
                  count: hc._count.createdAt,
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

              totalViews = await prisma.pageView.count({
                where,
              });

              totalCount = await prisma.pageView.groupBy({
                by: ['screenSize'],
                _count: {
                  createdAt: true,
                },
                where,
              });

              totalCount.map((hc) => {
                viewsCounts.push({
                  name: `${JSON.parse(JSON.stringify(hc.screenSize))
                    ?.width} x ${JSON.parse(JSON.stringify(hc.screenSize))
                    ?.height}`,
                  count: hc._count.createdAt,
                });
              });

              break;
            case 'current-year':
              // Loop through each month of the year
              // Get the first and last day of the current month
              const firstDayOfMonth = new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate()
              );
              const lastDayOfMonth = new Date(
                today.getFullYear() + 1,
                today.getMonth(),
                today.getDate()
              ); // Last day of the month at 23:59:59.999

              where = {
                createdAt: {
                  gte: firstDayOfMonth,
                  lte: lastDayOfMonth,
                },
              };

              // Calculate the user count for the current month
              totalViews = await prisma.pageView.count({
                where,
              });

              totalCount = await prisma.pageView.groupBy({
                by: ['screenSize'],
                _count: {
                  createdAt: true,
                },
                where,
              });

              totalCount.map((hc) => {
                viewsCounts.push({
                  name: `${JSON.parse(JSON.stringify(hc.screenSize))
                    ?.width} x ${JSON.parse(JSON.stringify(hc.screenSize))
                    ?.height}`,
                  count: hc._count.createdAt,
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

              totalViews = await prisma.pageView.count({
                where,
              });

              totalCount = await prisma.pageView.groupBy({
                by: ['screenSize'],
                _count: {
                  createdAt: true,
                },
                where,
              });

              totalCount.map((hc) => {
                viewsCounts.push({
                  name: `${JSON.parse(JSON.stringify(hc.screenSize))
                    ?.width} x ${JSON.parse(JSON.stringify(hc.screenSize))
                    ?.height}`,
                  count: hc._count.createdAt,
                });
              });

              break;
          }

          return (
            {
              devicesViews: viewsCounts || [],
              totalViews: totalViews || 0,
            } || {}
          );
        } catch (error: any) {
          console.log(error);
          throw error;
        }
      }),
  }),
});

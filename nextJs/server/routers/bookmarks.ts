import { prisma } from '@/utils/prisma';
import { z } from 'zod';
import { protectedProcedure, publicProcedure, router } from '../trpc';

export const bookmarksRouter = router({
  getInfinite: protectedProcedure
    .input(
      z.object({
        cursor: z.string().nullish(),
        keyword: z.string().optional(),
        major: z.string().optional(),
        degree: z.string().optional(),
        year: z.string().optional(),
      })
    )
    .query(async ({ input, ctx: { session } }) => {
      const { keyword, major, degree, year, cursor } = input;

      const limit = 10;

      const where: {
        user_id: string;
        keyword?: string;
        resource_class?: string;
        resource_major?: string;
        resource_degree?: string;
        resource_year?: string;
      } = {
        user_id: session?.user?.id!,
      };

      if (keyword) {
        where.keyword = keyword;
      }
      if (keyword) {
        where.resource_class = keyword;
      }
      if (major) {
        where.resource_major = major;
      }
      if (degree) {
        where.resource_degree = degree;
      }
      if (year) {
        where.resource_year = year;
      }

      let data = [];
      try {
        data = await prisma.bookmark.findMany({
          where: where,
          take: limit + 1,
          cursor: cursor ? { id: cursor } : undefined,
          orderBy: {
            createdAt: 'asc',
          },
          include: {
            resource: true,
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
  get: protectedProcedure.query(async ({ input, ctx: { session } }) => {
    //

    try {
      // const bookmarks = await prisma.bookmark.findMany({
      //   where: {
      //     user_id: input?.id,
      //   },
      //   select: {
      //     resource_id: true,
      //   },
      // });

      // return bookmarks.map((bookmark) => bookmark.resource_id);
      const bookmarks = await prisma.user.findUnique({
        where: {
          id: session?.user?.id,
        },
        select: {
          bookmarks: true,
        },
      });
      return bookmarks?.bookmarks || [];
    } catch (error: any) {
      console.log(error);
      throw error;
    }
    // return data;
    return {};
  }),
  add: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        degree: z.string(),
        major: z.string(),
        class: z.string(),
        year: z.string(),
      })
    )
    .mutation(async ({ input, ctx: { session } }) => {
      try {
        // const exist = await

        const exist = await prisma.bookmark.findUnique({
          where: {
            user_id: session?.user?.id,
            resource_id: input?.id,
          },
        });

        if (exist) {
          throw new Error('Bookmark exists already.');
        }

        await prisma.$transaction([
          prisma.bookmark.create({
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
              resource_class: input?.class,
              resource_degree: input?.degree,
              resource_major: input?.major,
              resource_year: input?.year,
              createdAt: new Date(),
            },
          }),
          prisma.user.update({
            where: {
              id: session?.user?.id,
            },
            data: {
              bookmarks: {
                push: [input?.id],
              },
            },
          }),
        ]);
      } catch (error: any) {
        console.log(error);
        throw error;
      }
    }),
  remove: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input, ctx: { session } }) => {
      try {
        const [bookmark, bookmarks] = await prisma.$transaction([
          prisma.bookmark.findUnique({
            where: {
              resource_id: input?.id,
              user_id: session?.user?.id,
            },
          }),
          prisma.user.findUnique({
            where: {
              id: session?.user?.id,
            },
            select: {
              bookmarks: true,
            },
          }),
        ]);

        if (!bookmark) {
          throw new Error('Bookmark not found.');
        }
        await prisma.bookmark.delete({
          where: {
            id: bookmark?.id,
          },
        });

        if (bookmarks) {
          const newBookmarks = bookmarks?.bookmarks.filter(
            (bookmark: any) => bookmark !== input?.id
          );
          await prisma.user.update({
            where: {
              id: session?.user?.id,
            },
            data: {
              bookmarks: newBookmarks,
            },
          });
        }

        // await createUser(input);
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
          const bookmarkCount = await prisma.bookmark.count({
            where: {
              resource_id: input?.id,
            },
          });
          return bookmarkCount || 0;
        } catch (error: any) {
          console.log(error);
          throw error;
        }
      }),
  }),
});

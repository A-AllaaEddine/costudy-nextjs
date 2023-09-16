import { z } from 'zod';
import { protectedProcedure, publicProcedure, router } from '../trpc';
import { createUser } from '@/utils/mongo';
import { prisma } from '@/utils/prisma';
import { hashPassword } from '@/utils/bcryptUtils';

export const userRouter = router({
  get: protectedProcedure
    .input(
      z.object({
        page: z.number(),
        keyword: z.string().optional(),
        major: z.string().optional(),
        degree: z.string().optional(),
        year: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      // Retrieve users from a datasource, this is an imaginary database
      // const data = await getResources(input);

      // return data;
      return {};
    }),
  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        username: z.string(),
        email: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ input, ctx: { session } }) => {
      if (session) {
        throw new Error('Not allowed');
      }
      const { email, name, password, username } = input;

      try {
        const emailExist = await prisma.authentication.findUnique({
          where: {
            email: email,
          },
        });

        if (emailExist?.email) {
          throw new Error('Email already exist');
        }

        const usernameExist = await prisma.authentication.findUnique({
          where: {
            username: username,
          },
        });

        if (usernameExist?.username) {
          throw new Error('Username taken');
        }

        const hashedPassword = await hashPassword(password);

        const { id } = await prisma.authentication.create({
          data: {
            email,
            name,
            password: hashedPassword,
            username,
            accountStatus: 'active',
            createdAt: new Date(),
            type: 'user',
            emailVerified: false,
            updatedAt: new Date(),
            profilePicture: '/vercel.svg',
          },
        });

        await prisma.user.create({
          data: {
            id: id,
            email,
            name,
            username,
            accountStatus: 'active',
            createdAt: new Date(),
            type: 'user',
            emailVerified: false,
            bookmarks: [],
            updatedAt: new Date(),
            profilePicture: '/vercel.svg',
          },
        });

        // await createUser(input);
      } catch (error: any) {
        console.log(error);
        throw error;
      }
    }),
});

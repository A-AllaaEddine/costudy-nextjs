import { z } from 'zod';
import { protectedProcedure, publicProcedure, router } from '../trpc';
import { createUser } from '@/utils/mongo';
import { prisma } from '@/utils/prisma';
import { hashPassword, verifyPassword } from '@/utils/bcryptUtils';

export const userRouter = router({
  get: protectedProcedure.query(async ({ input, ctx: { session } }) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: session?.user?.id,
        },
      });
      return user || {};
    } catch (error: any) {
      console.log(error);
      throw error;
    }
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
  update: protectedProcedure
    .input(
      z.object({
        name: z.string().optional(),
        username: z.string().optional(),
        email: z.string().optional(),
        currentPassword: z.string().optional(),
        newPassword: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx: { session } }) => {
      //   const { email, name, surname, username, type, job, state, city, phone } =
      //     input;

      try {
        if (input?.currentPassword) {
          const userAuth = await prisma.authentication.findUnique({
            where: {
              id: session?.user?.id,
            },
          });

          if (!userAuth) {
            throw new Error('No User');
          }

          const isValid = await verifyPassword(
            input?.currentPassword,
            userAuth?.password!
          );

          if (!isValid) {
            throw new Error('Wrong Password');
          }

          const hashedPassword = await hashPassword(input?.newPassword!);
          await prisma.authentication.update({
            where: {
              id: session?.user?.id,
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
            id: session?.user?.id,
          },
          data: {
            ...input,
            updatedAt: new Date(),
          },
        });
      } catch (error: any) {
        console.log(error);
        throw new Error(error.message);
      }
    }),
  delete: protectedProcedure.mutation(async ({ ctx: { session } }) => {
    try {
      await prisma.$transaction([
        prisma.user.delete({
          where: {
            id: session?.user?.id,
          },
        }),
        prisma.authentication.delete({
          where: {
            id: session?.user?.id,
          },
        }),
      ]);
    } catch (error: any) {
      console.log(error);
      throw new Error(error.message);
    }
  }),
});

import { authenticationUser } from '@/types/types';
import type { AuthOptions } from 'next-auth';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
// import { PrismaAdapter } from '@auth/prisma-adapter';
import { verifyPassword } from '@/utils/bcryptUtils';
import { prisma } from '@/utils/prisma';

export const authOptions: AuthOptions = {
  // adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { type: 'text', placeholder: 'Email' },
        password: {
          type: 'password',
          placeholder: 'Password',
        },
      },
      async authorize(credentials) {
        try {
          const user = await prisma.authentication.findUnique({
            where: { email: credentials?.email },
          });

          if (!user) {
            throw new Error('No User');
          }
          const isValid = await verifyPassword(
            credentials?.password!,
            user?.password!
          );

          if (!isValid) {
            throw new Error('Wrong Password');
          }

          if (user?.accountStatus === 'suspended') {
            throw new Error('suspended');
          }
          if (user?.accountStatus === 'banned') {
            throw new Error('banned');
          }

          if (user) {
            return { ...user, password: '' };
          }
          return null;
        } catch (error: any) {
          console.log(error);
          throw new Error(error.message);
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ user, trigger, token, session }) {
      if (user) {
        const myUser = await prisma.user.findUnique({
          where: {
            email: user.email!,
          },
        });
        token = { ...token, user: myUser! };
      }
      if (token.email) {
        const myUser = await prisma.user.findUnique({
          where: {
            email: token.email!,
          },
        });
        token = { ...token, user: myUser! };
      }

      if (trigger === 'update') {
        token = { ...token, ...session };
      }

      return token;
    },
    async session({ session, token }) {
      const myUser = { ...session.user, ...token.user } as authenticationUser;
      session = {
        ...session,
        user: myUser,
      };

      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

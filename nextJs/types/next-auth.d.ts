import NextAuth from 'next-auth';
import { authenticationUser } from './types';
declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */

  interface Session {
    user: {
      id: string;
      accountStatus: string;
      username: string;
      email: string;
      emailVerified: boolean;
      name: string;
      profilePicture: string;
      type: string;
      bookmarks: string[];
      createdAt: Date;
      updatedAt: Date | null;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user: {
      id: string;
      accountStatus: string;
      username: string;
      email: string;
      emailVerified: boolean;
      name: string;
      profilePicture: string;
      type: string;
      bookmarks: string[];
      createdAt: Date;
      updatedAt: Date | null;
    };
  }
}

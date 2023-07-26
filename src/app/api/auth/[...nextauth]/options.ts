import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '@/utils/prisma';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import bcrypt from 'bcrypt';

export const options: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email:',
          type: 'email',
          placeholder: 'your email',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },
      async authorize(credentials, req) {
        if (!credentials) {
          throw new Error('no credentials');
        }
        const user = await prisma.user.findUnique({
          where: {
            email: credentials?.email,
          },
        });

        if (!user) {
          throw new Error('no user');
        }

        if (!user.hashedPassword) {
          throw new Error('no hash');
        }

        const match = await bcrypt.compare(
          credentials?.password,
          user.hashedPassword
        );

        if (!match) {
          throw new Error('password error');
        }

        return user;
      },
    }),
  ],
  secret: process.env.SECRET,
  session: {
    strategy: 'jwt',
  },
  debug: process.env.NODE_ENV === 'development',
};

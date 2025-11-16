/**
 * NextAuth Configuration
 *
 * Authentication setup for the application using NextAuth v5
 */

import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import { Role, UserStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email as string,
          },
        });

        if (!user || !user.password) {
          throw new Error('Invalid credentials');
        }

        // Check if user account is active
        if (user.status !== UserStatus.ACTIVE) {
          if (user.status === UserStatus.PENDING) {
            throw new Error('Account pending approval');
          } else if (user.status === UserStatus.SUSPENDED) {
            throw new Error('Account suspended');
          } else if (user.status === UserStatus.INACTIVE) {
            throw new Error('Account inactive');
          }
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isCorrectPassword) {
          throw new Error('Invalid credentials');
        }

        // Get IP address from request headers
        const ipAddress = req?.headers?.get?.('x-forwarded-for')?.split(',')[0] ||
                         req?.headers?.get?.('x-real-ip') ||
                         'unknown';

        // Update last login, increment login count, and create audit log
        await prisma.$transaction([
          prisma.user.update({
            where: { id: user.id },
            data: {
              lastLoginAt: new Date(),
              lastLoginIp: ipAddress,
              loginCount: { increment: 1 }
            },
          }),
          prisma.auditLog.create({
            data: {
              userId: user.id,
              action: 'USER_LOGIN',
              resource: 'User',
              resourceId: user.id,
              ipAddress: ipAddress,
              metadata: {
                email: user.email,
                role: user.role,
                timestamp: new Date().toISOString(),
              },
            },
          }),
        ]);

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          status: user.status,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.status = user.status;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
        session.user.status = token.status as UserStatus;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
});

// Export authOptions for backward compatibility if needed
export const authOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email as string,
          },
        });

        if (!user || !user.password) {
          throw new Error('Invalid credentials');
        }

        // Check if user account is active
        if (user.status !== UserStatus.ACTIVE) {
          if (user.status === UserStatus.PENDING) {
            throw new Error('Account pending approval');
          } else if (user.status === UserStatus.SUSPENDED) {
            throw new Error('Account suspended');
          } else if (user.status === UserStatus.INACTIVE) {
            throw new Error('Account inactive');
          }
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isCorrectPassword) {
          throw new Error('Invalid credentials');
        }

        // Get IP address from request headers
        const ipAddress = req?.headers?.get?.('x-forwarded-for')?.split(',')[0] ||
                         req?.headers?.get?.('x-real-ip') ||
                         'unknown';

        // Update last login, increment login count, and create audit log
        await prisma.$transaction([
          prisma.user.update({
            where: { id: user.id },
            data: {
              lastLoginAt: new Date(),
              lastLoginIp: ipAddress,
              loginCount: { increment: 1 }
            },
          }),
          prisma.auditLog.create({
            data: {
              userId: user.id,
              action: 'USER_LOGIN',
              resource: 'User',
              resourceId: user.id,
              ipAddress: ipAddress,
              metadata: {
                email: user.email,
                role: user.role,
                timestamp: new Date().toISOString(),
              },
            },
          }),
        ]);

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          status: user.status,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.status = user.status;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
        session.user.status = token.status as UserStatus;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt' as const,
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

import NextAuth, { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '@/libs/prismadb';
import bcrypt from 'bcrypt';

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error('Invalid email or password');
        }
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user || !user.hashedPassword) {
          throw new Error('Invalid email or password');
        }
        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword,
        );
        if (!isCorrectPassword) {
          throw new Error('Invalid email or password');
        }
        return user;
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  debug: process.env.NODE_ENV === 'development',
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    // ── Link Google account to existing credentials account ──────────────────
    async signIn({ user, account, profile }) {
      // Only intercept Google sign-ins
      if (account?.provider === 'google') {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
            include: { accounts: true },
          });

          if (existingUser) {
            // Check if Google account is already linked
            const alreadyLinked = existingUser.accounts.some(
              (a) => a.provider === 'google',
            );

            if (!alreadyLinked) {
              // Link the Google account to the existing user
              await prisma.account.create({
                data: {
                  userId: existingUser.id,
                  type: account.type,
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                  access_token: account.access_token,
                  expires_at: account.expires_at,
                  token_type: account.token_type,
                  scope: account.scope,
                  id_token: account.id_token,
                },
              });

              // Update user image from Google if they don't have one
              if (!existingUser.image && profile?.image) {
                await prisma.user.update({
                  where: { id: existingUser.id },
                  data: { image: (profile as any).picture ?? profile.image },
                });
              }
            }

            // Allow sign in — use existing user's id
            user.id = existingUser.id;
          }
        } catch (error) {
          console.error('Error linking Google account:', error);
          return false;
        }
      }
      return true;
    },

    // ── Put id, role and image into the JWT token ────────────────────────────
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role ?? 'USER';
        token.image = (user as any).image ?? null;
      }

      // Always re-fetch from DB so role and image stay current
      const userId = (token.id ?? token.sub) as string | undefined;
      if (userId) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, role: true, image: true, name: true },
          });
          if (dbUser) {
            token.id = dbUser.id;
            token.role = dbUser.role;
            token.image = dbUser.image;
            token.name = dbUser.name;
          }
        } catch {
          // DB lookup failed — keep existing token values
        }
      }

      return token;
    },

    // ── Expose id, role and image on the session ─────────────────────────────
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id ?? token.sub;
        (session.user as any).role = token.role ?? 'USER';
        session.user.image =
          (token.image as string | null) ?? session.user.image ?? null;
        session.user.name = (token.name as string) ?? session.user.name;
      }
      return session;
    },
  },
  secret: process.env.NETXAUTH_SECRET,
};

export default NextAuth(authOptions);

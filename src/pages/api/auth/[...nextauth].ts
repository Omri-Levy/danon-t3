import GoogleProvider from 'next-auth/providers/google';
import NextAuth, { type NextAuthOptions } from 'next-auth';

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '../../../server/db/client';
import { env } from 'src/env/server.mjs';

export const authOptions: NextAuthOptions = {
	// Include user.id on session
	callbacks: {
		session({ session, user }) {
			if (session.user) {
				session.user.id = user.id;
			}
			return session;
		},
		signIn({ profile }) {
			return profile.email === env.EMAIL;
		},
	},
	// Configure one or more authentication providers
	adapter: PrismaAdapter(prisma),
	providers: [
		GoogleProvider({
			clientId: env.CLIENT_ID,
			clientSecret: env.CLIENT_SECRET,
		}),
	],
};

export default NextAuth(authOptions);

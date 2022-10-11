import AzureADProvider from 'next-auth/providers/azure-ad';
import NextAuth, { type NextAuthOptions } from 'next-auth';
import { db } from '../../../db/client';
import { env } from '../../../common/env/server.mjs';
import { KyselyAdapter } from '../../../db/KyselyAdapter';

export const authOptions: NextAuthOptions = {
	callbacks: {
		session({ session, user }) {
			if (session.user) {
				session.user.id = user.id;
			}
			return session;
		},
		redirect({ url, baseUrl }) {
			// Allows relative callback URLs
			if (url.startsWith('/')) return `${baseUrl}${url}`;

			// Allows callback URLs on the same origin
			if (new URL(url).origin === baseUrl) return url;

			return baseUrl;
		},
	},
	// Configure one or more authentication providers
	adapter: KyselyAdapter(db),
	pages: {
		signIn: '/auth/sign-in',
		error: '/auth/error',
	},
	providers: [
		AzureADProvider({
			clientId: env.AZURE_AD_CLIENT_ID,
			clientSecret: env.AZURE_AD_CLIENT_SECRET,
			tenantId: env.AZURE_AD_TENANT_ID,
		}),
	],
};

export default NextAuth(authOptions);

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

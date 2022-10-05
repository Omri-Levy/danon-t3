import AzureADProvider from 'next-auth/providers/azure-ad';
import NextAuth, { type NextAuthOptions } from 'next-auth';
import { db } from '../../../server/db/client';
import { env } from 'src/env/server.mjs';
import { KyselyAdapter } from '../../../server/db/KyselyAdapter';

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
	adapter: KyselyAdapter(db),
	pages: {
		signIn: '/auth/sign-in',
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

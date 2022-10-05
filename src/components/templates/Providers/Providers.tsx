import { queryClient, trpc, trpcClient } from '../../../utils/trpc';
import { QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { AuthLayout } from '../AuthLayout/AuthLayout';

export const Providers = ({
	session,
	children,
}: {
	session: any;
	children: any;
}) => {
	return (
		<trpc.Provider queryClient={queryClient} client={trpcClient}>
			<QueryClientProvider client={queryClient}>
				<SessionProvider session={session}>
					<AuthLayout>{children}</AuthLayout>
				</SessionProvider>
			</QueryClientProvider>
		</trpc.Provider>
	);
};

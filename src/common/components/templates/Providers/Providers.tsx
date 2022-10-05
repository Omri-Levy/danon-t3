import { QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { AuthLayout } from '../../../../auth/components/templates/AuthLayout/AuthLayout';
import { TComponentWithChildren } from '../../../types';
import { IProvidersProps } from './interfaces';
import { queryClient } from '../../../utils/trpc/query-client';
import { trpc, trpcClient } from 'src/common/utils/trpc/trpc-clients';

export const Providers: TComponentWithChildren<IProvidersProps> = ({
	session,
	children,
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

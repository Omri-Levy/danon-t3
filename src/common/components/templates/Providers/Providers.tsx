import { QueryClientProvider } from '@tanstack/react-query';
import { TComponentWithChildren } from '../../../types';
import { queryClient } from '../../../utils/trpc/query-client';
import { trpc, trpcClient } from 'src/common/utils/trpc/trpc-clients';

export const Providers: TComponentWithChildren = ({ children }) => {
	return (
		<trpc.Provider queryClient={queryClient} client={trpcClient}>
			<QueryClientProvider client={queryClient}>
				{children}
			</QueryClientProvider>
		</trpc.Provider>
	);
};

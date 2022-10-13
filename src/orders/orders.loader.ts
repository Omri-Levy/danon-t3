import { QueryClient } from '@tanstack/react-query';
import { TOrderGetAllOutput } from '../common/types';
import { trpcProxyClient } from '../common/utils/trpc/trpc-clients';

export const ordersLoader =
	(queryClient: QueryClient) => async () => {
		const orders =
			queryClient.getQueryData<TOrderGetAllOutput>([
				'orders.getAll',
			]) ??
			queryClient.fetchQuery(['orders.getAll'], () =>
				trpcProxyClient.orders.getAll.query(),
			);

		return {
			orders,
		};
	};

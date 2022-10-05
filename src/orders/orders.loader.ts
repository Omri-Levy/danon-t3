import { QueryClient } from '@tanstack/react-query';
import { TOrderGetAllOutput } from '../common/types';
import { trpcProxyClient } from '../common/utils/trpc/trpc-clients';

export const ordersLoader =
	(queryClient: QueryClient) => async () => {
		return (
			queryClient.getQueryData<TOrderGetAllOutput>([
				'orders.getAll',
			]) ??
			(await queryClient.fetchQuery(['orders.getAll'], () =>
				trpcProxyClient.orders.getAll.query(),
			))
		);
	};

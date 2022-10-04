import { QueryClient } from '@tanstack/react-query';
import { trpcProxyClient } from '../../../utils/trpc';
import { OrderGetAllOutput } from '../../../types';

export const loader = (queryClient: QueryClient) => async () => {
	return (
		queryClient.getQueryData<OrderGetAllOutput>([
			'orders.getAll',
		]) ??
		(await queryClient.fetchQuery(['orders.getAll'], () =>
			trpcProxyClient.orders.getAll.query(),
		))
	);
};

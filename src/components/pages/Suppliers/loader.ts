import { QueryClient } from '@tanstack/react-query';
import { trpcProxyClient } from '../../../utils/trpc';
import { SupplierGetAllOutput } from '../../../types';

export const loader = (queryClient: QueryClient) => async () => {
	return (
		queryClient.getQueryData<SupplierGetAllOutput>([
			'suppliers.getAll',
		]) ??
		(await queryClient.fetchQuery(['suppliers.getAll'], () =>
			trpcProxyClient.suppliers.getAll.query(),
		))
	);
};

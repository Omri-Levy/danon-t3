import { QueryClient } from '@tanstack/react-query';
import { TSupplierGetAllOutput } from '../common/types';
import { trpcProxyClient } from '../common/utils/trpc/trpc-clients';

export const suppliersLoader =
	(queryClient: QueryClient) => async () => {
		return (
			queryClient.getQueryData<TSupplierGetAllOutput>([
				'suppliers.getAll',
			]) ??
			(await queryClient.fetchQuery(['suppliers.getAll'], () =>
				trpcProxyClient.suppliers.getAll.query(),
			))
		);
	};

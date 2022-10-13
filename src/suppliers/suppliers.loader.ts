import { QueryClient } from '@tanstack/react-query';
import { TSupplierGetAllOutput } from '../common/types';
import { trpcProxyClient } from '../common/utils/trpc/trpc-clients';

export const suppliersLoader =
	(queryClient: QueryClient) => async () => {
		const suppliers =
			queryClient.getQueryData<TSupplierGetAllOutput>([
				'suppliers.getAll',
			]) ??
			queryClient.fetchQuery(['suppliers.getAll'], () =>
				trpcProxyClient.suppliers.getAll.query(),
			);

		return {
			suppliers,
		};
	};

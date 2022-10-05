import { QueryClient } from '@tanstack/react-query';
import {
	TProductGetAllOutput,
	TSupplierGetAllOutput,
} from '../common/types';
import { trpcProxyClient } from '../common/utils/trpc/trpc-clients';

export const productsLoader =
	(queryClient: QueryClient) => async () => {
		const products =
			queryClient.getQueryData<TProductGetAllOutput>([
				'products.getAll',
			]) ??
			(await queryClient.fetchQuery(['products.getAll'], () =>
				trpcProxyClient.products.getAll.query(),
			));
		const suppliers =
			queryClient.getQueryData<TSupplierGetAllOutput>([
				'suppliers.getAll',
			]) ??
			(await queryClient.fetchQuery(['suppliers.getAll'], () =>
				trpcProxyClient.suppliers.getAll.query(),
			));

		return {
			products,
			suppliers,
		};
	};

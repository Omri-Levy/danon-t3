import { QueryClient } from '@tanstack/react-query';
import { trpcProxyClient } from '../../../utils/trpc';
import {
	ProductGetAllOutput,
	SupplierGetAllOutput,
} from '../../../types';

export const loader = (queryClient: QueryClient) => async () => {
	const products =
		queryClient.getQueryData<ProductGetAllOutput>([
			'products.getAll',
		]) ??
		(await queryClient.fetchQuery(['products.getAll'], () =>
			trpcProxyClient.products.getAll.query(),
		));
	const suppliers =
		queryClient.getQueryData<SupplierGetAllOutput>([
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

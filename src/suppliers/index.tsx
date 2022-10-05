import { lazy } from 'react';
import { suppliersLoader } from './suppliers.loader';
import { queryClient } from '../common/utils/trpc/query-client';

const LazySuppliers = lazy(async () => {
	const { Suppliers } = await import('./suppliers.page');

	return { default: Suppliers };
});
export const suppliers = {
	path: '/suppliers',
	element: <LazySuppliers />,
	loader: suppliersLoader(queryClient),
};

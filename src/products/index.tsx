import { lazy } from 'react';
import { productsLoader } from './products.loader';
import { queryClient } from '../common/utils/trpc/query-client';

const LazyProducts = lazy(async () => {
	const { Products } = await import('./products.page');

	return { default: Products };
});
export const products = {
	path: '/',
	element: <LazyProducts />,
	loader: productsLoader(queryClient),
};

import { lazy } from 'react';
import { stockLoader } from './stock.loader';
import { queryClient } from '../common/utils/trpc/query-client';

const LazyStock = lazy(async () => {
	const { Stock } = await import('./stock.page');

	return { default: Stock };
});
export const stock = {
	path: '/stock',
	element: <LazyStock />,
	loader: stockLoader(queryClient),
};

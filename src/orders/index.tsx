import { lazy } from 'react';
import { ordersLoader } from './orders.loader';
import { queryClient } from '../common/utils/trpc/query-client';
import { Outlet } from 'react-router-dom';

const LazyOrders = lazy(async () => {
	const { Orders } = await import('./orders.page');

	return { default: Orders };
});
export const orders = {
	path: '/orders',
	element: <LazyOrders />,
	loader: ordersLoader(queryClient),
	children: [
		{
			path: '/orders/:orderId',
			element: <Outlet />,
		},
	],
};

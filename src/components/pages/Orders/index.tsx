import { lazy } from 'react';
import { loader } from './loader';

const LazyOrders = lazy(() => import('../../pages/Orders/Orders'));
export const Orders = {
	path: '/orders',
	element: <LazyOrders />,
	loader,
};

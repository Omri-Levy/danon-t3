import {
	createBrowserRouter,
	Outlet,
	RouterProvider,
} from 'react-router-dom';
import { FunctionComponent, Suspense } from 'react';
import { products } from '../../../../products';
import { suppliers } from '../../../../suppliers';
import { orders } from '../../../../orders';

const router = createBrowserRouter([
	{
		path: '/',
		element: (
			<Suspense>
				<Outlet />
			</Suspense>
		),
		children: [products, suppliers, orders],
	},
]);

const Routes: FunctionComponent = () => (
	<RouterProvider router={router} />
);

export default Routes;

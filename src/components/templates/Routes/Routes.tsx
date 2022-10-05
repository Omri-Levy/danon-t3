import {
	createBrowserRouter,
	Outlet,
	RouterProvider,
} from 'react-router-dom';
import { Home } from '../../pages/Home';
import { Suspense } from 'react';
import { Suppliers } from '../../pages/Suppliers';
import { Orders } from '../../pages/Orders';
import { queryClient } from '../../../utils/trpc';

const router = createBrowserRouter([
	{
		path: '/',
		element: (
			<Suspense>
				<Outlet />
			</Suspense>
		),
		children: [
			{
				path: Suppliers.path,
				element: Suppliers.element,
				loader: Suppliers.loader(queryClient),
			},
			{
				path: Orders.path,
				element: Orders.element,
				loader: Orders.loader(queryClient),
			},
			{
				path: Home.path,
				element: Home.element,
				loader: Home.loader(queryClient),
			},
		],
	},
]);

const Routes = () => <RouterProvider router={router} />;

export default Routes;

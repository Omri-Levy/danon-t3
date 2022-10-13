import {
	createBrowserRouter,
	Outlet,
	RouterProvider,
} from 'react-router-dom';
import { FunctionComponent, Suspense } from 'react';
import { products } from '../../../../products';
import { suppliers } from '../../../../suppliers';
import { orders } from '../../../../orders';
import { Providers } from '../Providers/Providers';
import { Spinner } from '../../atoms/Spinner/Spinner';
import { Toaster } from 'react-hot-toast';
import { Modal } from '../../molecules/Modal/Modal';
import { useModalsStore } from '../../../stores/modals/modals';

export const Root = () => {
	const { getModal } = useModalsStore();
	const Modal = getModal();

	return (
		<Suspense>
			<Providers>
				<Toaster
					position='top-center'
					containerStyle={{
						direction: 'rtl',
					}}
					toastOptions={{
						// In milliseconds - 1000 * 5 -> 5 seconds
						duration: 1000 * 10,
					}}
				/>
				<main className='flex flex-col items-center p-1 pt-[3vh] min-h-screen relative'>
					<Spinner />
					<Modal />
					<Outlet />
				</main>
			</Providers>
		</Suspense>
	);
};

const router = createBrowserRouter([
	{
		path: '/',
		element: <Root />,
		children: [products, suppliers, orders],
	},
]);

const Routes: FunctionComponent = () => (
	<RouterProvider router={router} />
);

export default Routes;

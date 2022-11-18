import {
	createBrowserRouter,
	Outlet,
	RouterProvider,
	useMatch,
	useNavigation,
} from 'react-router-dom';
import { FunctionComponent, Suspense, useEffect } from 'react';
import { products } from '../../../../products';
import { suppliers } from '../../../../suppliers';
import { orders } from '../../../../orders';
import { Providers } from '../Providers/Providers';
import { Spinner } from '../../atoms/Spinner/Spinner';
import { Toaster } from 'react-hot-toast';
import { Modal } from '../../molecules/Modal/Modal';
import { useModalsStore } from '../../../stores/modals/modals';
import { NavBar } from '../../organisms/NavBar/NavBar';
import clsx from 'clsx';
import { locale } from '../../../translations';
import NProgress from 'nprogress';
import { useDebounce } from 'react-use';
import { stock } from '../../../../stock';

NProgress.configure({ showSpinner: false });

export const Root = () => {
	const { getModal } = useModalsStore((state) => ({
		getModal: state.getModal,
	}));
	const Modal = getModal();
	const isProducts = useMatch('/')?.pathname;
	const { state } = useNavigation();
	const [, debouncedOnLoading] = useDebounce(
		() => {
			if (state !== 'idle') {
				NProgress.start();

				return;
			}

			NProgress.done();
		},
		500,
		// Without all of these all search params but filter_by and filter work.
		[state],
	);

	useEffect(() => {
		debouncedOnLoading();
	}, [debouncedOnLoading]);

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
						duration: 1000 * 5,
					}}
				/>
				<header
					className={clsx([
						{
							'w-fit xl:w-full xl:max-w-[1536px]':
								!isProducts,
							'w-fit 2xl:w-full 2xl:max-w-[1536px]':
								isProducts,
						},
						`mx-auto relative pt-[3vh]`,
					])}
				>
					<NavBar />
					<a
						className={`btn absolute top-0 right-0 gap-2`}
						href={`/api/auth/federated-sign-out`}
					>
						{locale.he.signOut}
						<svg
							xmlns='http://www.w3.org/2000/svg'
							viewBox='0 0 20 20'
							fill='currentColor'
							className='w-5 h-5'
						>
							<path
								fillRule='evenodd'
								d='M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z'
								clipRule='evenodd'
							/>
							<path
								fillRule='evenodd'
								d='M6 10a.75.75 0 01.75-.75h9.546l-1.048-.943a.75.75 0 111.004-1.114l2.5 2.25a.75.75 0 010 1.114l-2.5 2.25a.75.75 0 11-1.004-1.114l1.048-.943H6.75A.75.75 0 016 10z'
								clipRule='evenodd'
							/>
						</svg>
					</a>
				</header>
				<main className='flex flex-col items-center p-1 min-h-full relative'>
					<Spinner />
					<Modal />
					<section
						className={clsx([
							{
								'w-fit xl:w-full xl:max-w-[1536px]':
									!isProducts,
								'w-fit 2xl:w-full 2xl:max-w-[1536px]':
									isProducts,
							},
						])}
					>
						<Outlet />
					</section>
				</main>
			</Providers>
		</Suspense>
	);
};

const router = createBrowserRouter([
	{
		path: '/',
		element: <Root />,
		children: [products, suppliers, orders, stock],
	},
]);

const Routes: FunctionComponent = () => (
	<RouterProvider router={router} />
);

export default Routes;

import {
	createBrowserRouter,
	Outlet,
	RouterProvider,
	useNavigation,
} from 'react-router-dom';
import {
	FunctionComponent,
	Suspense,
	useCallback,
	useEffect,
} from 'react';
import { products } from '../../../../products';
import { suppliers } from '../../../../suppliers';
import { orders } from '../../../../orders';
import { Providers } from '../Providers/Providers';
import { Spinner } from '../../atoms/Spinner/Spinner';
import { Toaster } from 'react-hot-toast';
import { Modal } from '../../molecules/Modal/Modal';
import { useModalsStore } from '../../../stores/modals/modals';
import { NavBar } from '../../organisms/NavBar/NavBar';
import { locale } from '../../../translations';
import NProgress from 'nprogress';
import { useDebounce, useToggle } from 'react-use';
import { stock } from '../../../../stock';

NProgress.configure({ showSpinner: false });

export const Root = () => {
	const { getModal } = useModalsStore((state) => ({
		getModal: state.getModal,
	}));
	const Modal = getModal();
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
	const [isChecked, toggleIsChecked] = useToggle(false);
	const onToggleIsChecked = useCallback(
		() => toggleIsChecked(),
		[toggleIsChecked],
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
						duration: 1000 * 4,
					}}
				/>
				<div className={`drawer drawer-end drawer-mobile`}>
					<input
						id='dashboard-drawer'
						type='checkbox'
						className='drawer-toggle'
						checked={isChecked}
						onChange={onToggleIsChecked}
					/>
					<label
						htmlFor='dashboard-drawer'
						className='swap swap-rotate btn btn-circle drawer-button lg:hidden fixed bottom-2 left-6 z-50'
					>
						<input
							type={`checkbox`}
							checked={isChecked}
						/>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							viewBox='0 0 20 20'
							fill='currentColor'
							className='swap-off w-5 h-5'
						>
							<path
								fillRule='evenodd'
								d='M2 3.75A.75.75 0 012.75 3h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 3.75zm0 4.167a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75zm0 4.166a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75zm0 4.167a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z'
								clipRule='evenodd'
							/>
						</svg>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							viewBox='0 0 20 20'
							fill='currentColor'
							className='w-5 h-5 swap-on'
						>
							<path d='M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z' />
						</svg>
					</label>
					<div className={`drawer-content`}>
						<main className='w-full flex flex-col items-center p-1 min-h-full relative'>
							<Spinner />
							<Modal />
							<section
								className={`overflow-x-auto flex flex-col w-full`}
							>
								<Outlet />
							</section>
						</main>
					</div>
					<div className={`drawer-side overflow-x-hidden`}>
						<label
							htmlFor='dashboard-drawer'
							className='drawer-overlay'
						></label>
						<header
							className={`w-46 flex flex-col p-2 border-l border-l-base-content bg-base-100`}
						>
							<NavBar />
							<a
								className={`btn w-full gap-2 hover:bg-accent-focus`}
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
					</div>
				</div>
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

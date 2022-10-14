import { NavLink, useMatch } from 'react-router-dom';
import { locale } from '../../../translations';
import clsx from 'clsx';
import { FunctionComponent } from 'react';

export const NavBar: FunctionComponent = () => {
	const suppliers = useMatch('/suppliers')?.pathname;
	const products = useMatch('/')?.pathname;
	const orders = useMatch('/orders')?.pathname;

	return (
		<nav className={`navbar mx-auto`}>
			<ul className={`tabs tabs-boxed tabs-large mx-auto`}>
				<li
					className={clsx([
						'tab min-w-[12rem] text-lg p-0',
						{
							'tab-active': orders,
						},
					])}
				>
					<NavLink
						to={`/orders`}
						className={`flex items-center gap-2`}
					>
						{locale.he.orders}
						<svg
							xmlns='http://www.w3.org/2000/svg'
							viewBox='0 0 20 20'
							fill='currentColor'
							className='w-5 h-5'
						>
							<path
								fillRule='evenodd'
								d='M4.5 2A1.5 1.5 0 003 3.5v13A1.5 1.5 0 004.5 18h11a1.5 1.5 0 001.5-1.5V7.621a1.5 1.5 0 00-.44-1.06l-4.12-4.122A1.5 1.5 0 0011.378 2H4.5zm2.25 8.5a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5zm0 3a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z'
								clipRule='evenodd'
							/>
						</svg>
					</NavLink>
				</li>
				<li
					className={clsx([
						'tab min-w-[12rem] text-lg p-0',
						{
							'tab-active': products,
						},
					])}
				>
					<NavLink
						to={`/`}
						className={`flex items-center gap-2`}
					>
						{locale.he.products}
						<svg
							xmlns='http://www.w3.org/2000/svg'
							viewBox='0 0 20 20'
							fill='currentColor'
							className='w-5 h-5'
						>
							<path d='M2 3a1 1 0 00-1 1v1a1 1 0 001 1h16a1 1 0 001-1V4a1 1 0 00-1-1H2z' />
							<path
								fillRule='evenodd'
								d='M2 7.5h16l-.811 7.71a2 2 0 01-1.99 1.79H4.802a2 2 0 01-1.99-1.79L2 7.5zM7 11a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z'
								clipRule='evenodd'
							/>
						</svg>
					</NavLink>
				</li>
				<li
					className={clsx([
						'tab min-w-[12rem] text-lg p-0',
						{
							'tab-active': suppliers,
						},
					])}
				>
					<NavLink
						to={`/suppliers`}
						className={`flex items-center gap-2`}
					>
						{locale.he.suppliers}
						<svg
							xmlns='http://www.w3.org/2000/svg'
							viewBox='0 0 20 20'
							fill='currentColor'
							className='w-5 h-5'
						>
							<path d='M2.879 7.121A3 3 0 007.5 6.66a2.997 2.997 0 002.5 1.34 2.997 2.997 0 002.5-1.34 3 3 0 104.622-3.78l-.293-.293A2 2 0 0015.415 2H4.585a2 2 0 00-1.414.586l-.292.292a3 3 0 000 4.243zM3 9.032a4.507 4.507 0 004.5-.29A4.48 4.48 0 0010 9.5a4.48 4.48 0 002.5-.758 4.507 4.507 0 004.5.29V16.5h.25a.75.75 0 010 1.5h-4.5a.75.75 0 01-.75-.75v-3.5a.75.75 0 00-.75-.75h-2.5a.75.75 0 00-.75.75v3.5a.75.75 0 01-.75.75h-4.5a.75.75 0 010-1.5H3V9.032z' />
						</svg>
					</NavLink>
				</li>
			</ul>
		</nav>
	);
};

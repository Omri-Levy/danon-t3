import { NavLink, useLocation } from 'react-router-dom';
import { locale } from '../../../translations';
import clsx from 'clsx';
import { FunctionComponent } from 'react';

export const Navigation: FunctionComponent = () => {
	const { pathname } = useLocation();

	return (
		<>
			<NavLink
				to={'/orders'}
				className={({ isActive, isPending }) =>
					clsx([
						'btn',
						{
							'btn-primary btn-active': isActive,
						},
						{ loading: isPending },
					])
				}
			>
				{locale.he.orders}
			</NavLink>
			<NavLink
				to={'/'}
				end
				className={({ isActive, isPending }) =>
					clsx([
						'btn',
						{
							'btn-primary btn-active': isActive,
						},
						{ loading: isPending },
					])
				}
			>
				{locale.he.products}
			</NavLink>
			<NavLink
				to={'/suppliers'}
				className={({ isActive, isPending }) =>
					clsx([
						'btn',
						{
							'btn-primary btn-active': isActive,
						},
						{ loading: isPending },
					])
				}
			>
				{locale.he.suppliers}
			</NavLink>
		</>
	);
};

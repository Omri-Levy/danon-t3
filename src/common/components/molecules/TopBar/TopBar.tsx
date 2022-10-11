import { locale } from '../../../translations';
import clsx from 'clsx';
import { Navigation } from '../../organisms/Navigation/Navigation';
import { ChangeEventHandler, FunctionComponent } from 'react';
import { useTopBar } from './hooks/useTopBar/useTopBar';

export const TopBar: FunctionComponent<{
	resource: string;
	Actions: JSX.Element;
	globalFilter: string;
	onGlobalFilter: ChangeEventHandler<HTMLInputElement>;
	resourceCount: number;
}> = ({
	globalFilter,
	onGlobalFilter,
	resourceCount,
	Actions,
	resource,
}) => {
	const { isLoadingSession } = useTopBar();

	return (
		<div className={`flex justify-between mb-1 gap-1 flex-wrap`}>
			<div className={`space-x-2 flex items-center`}>
				{Actions}
				<Navigation />
			</div>
			<div className={`flex space-x-2 items-center`}>
				<div className='form-control'>
					<div className='input-group'>
						<input
							type='text'
							dir={globalFilter ? `auto` : `rtl`}
							placeholder={locale.he.search
								.replace(
									'$1',
									resourceCount?.toString(),
								)
								.replace('$2', resource)}
							className='input input-bordered !rounded-md'
							value={globalFilter ?? ''}
							onChange={onGlobalFilter}
						/>
						<div className='btn !rounded cursor-auto hover:bg-neutral'>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								className='h-6 w-6'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth='2'
									d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
								/>
							</svg>
						</div>
					</div>
				</div>
				<a
					className={clsx([
						`btn`,
						{ loading: isLoadingSession },
					])}
					href={`/api/auth/federated-sign-out`}
				>
					{locale.he.signOut}
				</a>
			</div>
		</div>
	);
};

import { locale } from '../../../translations';
import { ChangeEventHandler, FunctionComponent } from 'react';

export const TopBar: FunctionComponent<{
	resource: string;
	Actions: JSX.Element;
	TopBarEnd?: JSX.Element;
	globalFilter: string;
	onGlobalFilter: ChangeEventHandler<HTMLInputElement>;
	resourceCount: number;
}> = ({
	globalFilter,
	onGlobalFilter,
	resourceCount,
	Actions,
	TopBarEnd,
	resource,
}) => {
	return (
		<div
			className={`min-h-[5.5rem] min-w-[900px] flex justify-between mb-1 gap-1 flex-wrap`}
		>
			<div className={`space-x-2 flex items-end`}>
				{Actions}
			</div>
			<div className={`flex space-x-2 items-end`}>
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
							className='input input-bordered !rounded-box'
							value={globalFilter ?? ''}
							onChange={onGlobalFilter}
						/>
						<div className='btn !rounded-box cursor-auto hover:bg-neutral'>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								viewBox='0 0 20 20'
								fill='currentColor'
								className='w-5 h-5'
							>
								<path
									fillRule='evenodd'
									d='M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z'
									clipRule='evenodd'
								/>
							</svg>
						</div>
					</div>
				</div>
				{TopBarEnd}
			</div>
		</div>
	);
};

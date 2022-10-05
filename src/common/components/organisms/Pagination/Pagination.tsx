import { PropsWithChildren } from 'react';
import { RowData, Table } from '@tanstack/table-core';

export const Pagination = <TRowData extends RowData>({
	table,
}: PropsWithChildren<{
	table: Table<TRowData>;
}>) => {
	return (
		<div className='flex flex-col mt-1'>
			<strong className={`ml-auto`}>
				עמוד {table.getState().pagination.pageIndex + 1}/
				{table.getPageCount()}
			</strong>
			<div className='btn-group justify-end mt-1'>
				<button
					className='btn'
					onClick={() => table.setPageIndex(0)}
					disabled={!table.getCanPreviousPage()}
				>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						className='h-6 w-6'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'
						strokeWidth='2'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							d='M11 19l-7-7 7-7m8 14l-7-7 7-7'
						/>
					</svg>
				</button>
				<button
					disabled={!table.getCanPreviousPage()}
					className='btn'
					onClick={table.previousPage}
				>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						className='h-6 w-6'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'
						strokeWidth='2'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							d='M15 19l-7-7 7-7'
						/>
					</svg>
				</button>
				<button
					className='btn'
					disabled={!table.getCanNextPage()}
					onClick={table.nextPage}
				>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						className='h-6 w-6'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'
						strokeWidth='2'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							d='M9 5l7 7-7 7'
						/>
					</svg>
				</button>
				<button
					disabled={!table.getCanNextPage()}
					className='btn'
					onClick={() =>
						table.setPageIndex(table.getPageCount() - 1)
					}
				>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						className='h-6 w-6'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'
						strokeWidth='2'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							d='M13 5l7 7-7 7M5 5l7 7-7 7'
						/>
					</svg>
				</button>
			</div>
		</div>
	);
};

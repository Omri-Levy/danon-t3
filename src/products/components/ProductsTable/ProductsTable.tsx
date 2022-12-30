import { FunctionComponent } from 'react';
import { ReactTable } from '../../../common/components/molecules/ReactTable/ReactTable';
import { IProductsTableProps } from './interfaces';

export const ProductsTable: FunctionComponent<
	IProductsTableProps
> = ({ table }) => (
	<ReactTable
		table={table}
		HeadRow={({ children, headerGroup, ...props }) => (
			<tr {...props}>{children}</tr>
		)}
		BodyRow={({ children, ...props }) => (
			<tr className={`hover`} {...props}>
				{children}
			</tr>
		)}
		renderHeader={(header, render) => (
			<th
				align={header.id === 'select' ? undefined : 'center'}
				colSpan={header.colSpan}
				className={`z-10 sticky top-0 bg-neutral text-white`}
			>
				{header.isPlaceholder ? null : (
					<div
						{...{
							className: `${
								header.column.getCanSort()
									? 'cursor-pointer select-none'
									: ''
							}`,
							onClick:
								header.column.getToggleSortingHandler(),
						}}
					>
						{render}
						{!!header.column.getIsSorted() && (
							<svg
								xmlns='http://www.w3.org/2000/svg'
								className={`inline-block ml-2 h-6 w-6 ${
									header.column.getIsSorted() ===
									'desc'
										? 'rotate-180'
										: ''
								}`}
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'
								strokeWidth='2'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									d='M19 9l-7 7-7-7'
								/>
							</svg>
						)}
					</div>
				)}
			</th>
		)}
		renderCell={(cell, render, index) => (
			<td className={`p-0 pt-px`}>
				{cell.column.id === `index` ? (
					<strong>{index + 1}</strong>
				) : (
					render
				)}
			</td>
		)}
		className={`table table-zebra table-compact w-full`}
	/>
);

import { useReactTable } from '@tanstack/react-table';
import { getCoreRowModel } from '@tanstack/table-core';
import { ReactTable } from '../../molecules/ReactTable/ReactTable';
import { DanonFooter } from '../../atoms/DanonFooter/DanonFooter';
import { DanonLogo } from '../../atoms/DanonLogo/DanonLogo';

export const OrderTable = ({ columns, data }) => {
	const table = useReactTable({
		columns,
		data,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div className={`overflow-auto h-[60vh]`}>
			<DanonLogo />
			<ReactTable
				id={`order-table`}
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
						align={`center`}
						colSpan={header.colSpan}
						className={`sticky top-0 bg-neutral text-white`}
					>
						{header.isPlaceholder ? null : render}
					</th>
				)}
				renderCell={(cell, render) => (
					<td className={`padding-x-0`}>{render}</td>
				)}
				className={`table table-compact w-full`}
			/>
			<DanonFooter />
		</div>
	);
};

import { PropsWithChildren } from 'react';
import { flexRender } from '@tanstack/react-table';
import { Map } from '../../atoms/Map/Map';
import { IReactTableProps } from './interfaces';
import { Cell, Header, HeaderGroup, Row } from '@tanstack/table-core';

export const ReactTable = <TItem,>({
	tfoot,
	renderHeader,
	renderCell,
	HeadRow,
	BodyRow,
	table,
	...rest
}: PropsWithChildren<IReactTableProps<TItem>>) => {
	const renderTh =
		(headerGroup: HeaderGroup<TItem>) =>
		(header: Header<TItem, unknown>, index: number) => {
			if (header.isPlaceholder) {
				return null;
			}

			return renderHeader(
				header,
				flexRender(
					header.column.columnDef.header,
					header.getContext(),
				),
				index,
				index === headerGroup.headers.length - 1,
			);
		};

	const renderHead = (headerGroup: HeaderGroup<TItem>) => (
		<HeadRow headerGroup={headerGroup}>
			<Map
				items={headerGroup.headers}
				render={renderTh(headerGroup)}
			/>
		</HeadRow>
	);

	const renderTd =
		(index: number, row: Row<TItem>) =>
		(cell: Cell<TItem, unknown>) =>
			renderCell(
				cell,
				flexRender(
					cell.column.columnDef.cell,
					cell.getContext(),
				),
				index,
				index === row.getVisibleCells().length - 1,
			);

	const renderBody = (row: Row<TItem>, index: number) => (
		<BodyRow row={row}>
			<Map
				items={row.getVisibleCells()}
				render={renderTd(index, row)}
			/>
		</BodyRow>
	);

	return (
		<table {...rest}>
			<thead>
				<Map
					items={table.getHeaderGroups()}
					render={renderHead}
				/>
			</thead>
			<tbody>
				<Map
					items={table.getRowModel().rows}
					render={renderBody}
				/>
			</tbody>
			{tfoot}
		</table>
	);
};

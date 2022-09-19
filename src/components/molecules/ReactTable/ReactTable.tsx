import {
	Cell,
	Header,
	HeaderGroup,
	Row,
	Table,
} from '@tanstack/table-core';
import {
	DetailedHTMLProps,
	HTMLAttributes,
	ReactNode,
	TableHTMLAttributes,
} from 'react';
import { flexRender } from '@tanstack/react-table';
import { Map } from '../../atoms/Map/Map';

export const ReactTable = <TItem,>({
	tfoot,
	renderHeader,
	renderCell,
	HeadRow,
	BodyRow,
	table,
	...rest
}: {
	filter?: (row: Row<TItem>) => boolean;
	tfoot?: ReactNode;
	renderHeader: (
		header: Header<TItem, unknown>,
		render: JSX.Element | ReactNode,
		index: number,
		isLastItem: boolean,
	) => JSX.Element;
	renderCell: (
		cell: Cell<TItem, unknown>,
		render: JSX.Element | ReactNode,
		index: number,
		isLastItem: boolean,
	) => JSX.Element;
	HeadRow: (
		props: {
			headerGroup: HeaderGroup<TItem>;
		} & DetailedHTMLProps<
			HTMLAttributes<HTMLTableRowElement>,
			HTMLTableRowElement
		>,
	) => JSX.Element;
	BodyRow: (
		props: { row: Row<TItem> } & DetailedHTMLProps<
			HTMLAttributes<HTMLTableRowElement>,
			HTMLTableRowElement
		>,
	) => JSX.Element;
	table: Table<TItem>;
} & DetailedHTMLProps<
	TableHTMLAttributes<HTMLTableElement>,
	HTMLTableElement
>) => {
	return (
		<table {...rest}>
			<thead>
				<Map
					items={table.getHeaderGroups()}
					render={(headerGroup) => (
						<HeadRow headerGroup={headerGroup}>
							<Map
								items={headerGroup.headers}
								render={(header, index) => {
									if (header.isPlaceholder) {
										return null;
									}

									return renderHeader(
										header,
										flexRender(
											header.column.columnDef
												.header,
											header.getContext(),
										),
										index,
										index ===
											headerGroup.headers
												.length -
												1,
									);
								}}
							/>
						</HeadRow>
					)}
				/>
			</thead>
			<tbody>
				<Map
					items={table.getRowModel().rows}
					render={(row, index) => (
						<BodyRow row={row}>
							<Map
								items={row.getVisibleCells()}
								render={(cell) =>
									renderCell(
										cell,
										flexRender(
											cell.column.columnDef
												.cell,
											cell.getContext(),
										),
										index,
										index ===
											row.getVisibleCells()
												.length -
												1,
									)
								}
							/>
						</BodyRow>
					)}
				/>
			</tbody>
			{tfoot}
		</table>
	);
};

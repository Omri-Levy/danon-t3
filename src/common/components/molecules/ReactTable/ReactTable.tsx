import { PropsWithChildren } from 'react';
import { flexRender } from '@tanstack/react-table';
import { Map } from '../../atoms/Map/Map';
import { IReactTableProps } from './types';

export const ReactTable = <TItem,>({
	tfoot,
	renderHeader,
	renderCell,
	HeadRow,
	BodyRow,
	table,
	...rest
}: PropsWithChildren<IReactTableProps<TItem>>) => {
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

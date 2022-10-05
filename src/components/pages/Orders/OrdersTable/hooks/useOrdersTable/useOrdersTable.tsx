import {
	OrderGetAllOutput,
	OrderGetByIdOutput,
} from '../../../../../../types';
import { ChangeEventHandler, useCallback, useState } from 'react';
import { useSkipper } from '../../../../../../hooks/useSkipper/useSkipper';
import {
	ColumnDef,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	RowSelectionState,
	SortingState,
} from '@tanstack/table-core';
import { IndeterminateCheckbox } from '../../../../../atoms/IndeterminateCheckbox/IndeterminateCheckbox';
import { locale } from '../../../../../../translations';
import { useReactTable } from '@tanstack/react-table';
import { fuzzyFilter } from '../../../../../../utils/fuzzy-filter/fuzzy-filter';
import { ViewPDFButton } from './ViewPDFButton/ViewPDFButton';

export const useOrdersTable = (
	orders: OrderGetAllOutput,
	onIdChange: (id: string) => void,
	onOpen: () => void,
) => {
	const [globalFilter, setGlobalFilter] = useState('');
	const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();
	const [sorting, setSorting] = useState<SortingState>([
		{ id: 'createdAt', desc: false },
	]);
	const [rowSelection, setRowSelection] =
		useState<RowSelectionState>({});
	const columns: Array<ColumnDef<OrderGetByIdOutput>> = [
		{
			id: 'select',
			header: ({ table }) => (
				<div
					className={`bg-base-100 rounded p-px inline-flex`}
				>
					<IndeterminateCheckbox
						{...{
							checked: table.getIsAllRowsSelected(),
							indeterminate:
								table.getIsSomeRowsSelected(),
							onChange:
								table.getToggleAllRowsSelectedHandler(),
						}}
					/>
				</div>
			),
			cell: ({ row }) => (
				<IndeterminateCheckbox
					{...{
						checked: row.getIsSelected(),
						indeterminate: row.getIsSomeSelected(),
						onChange: row.getToggleSelectedHandler(),
					}}
				/>
			),
		},
		{
			accessorKey: 'rowIndex',
			header: '',
			cell: ({ cell }) => (
				<strong>{cell.getValue() as number}</strong>
			),
		},
		{
			header: locale.he.pdf,
			cell: (props) => (
				<ViewPDFButton
					orders={orders}
					onIdChange={onIdChange}
					onOpen={onOpen}
					{...props}
				/>
			),
		},
		{
			accessorKey: 'orderNumber',
			header: locale.he.orderNumber,
			cell: ({ getValue }) => {
				const value = getValue();

				if (typeof value !== 'number') {
					return value;
				}

				value?.toString().padStart(5, '0');
			},
		},
		{
			accessorKey: 'createdAt',
			header: locale.he.createdAt,
			cell: ({ getValue }) => {
				const value = getValue();

				if (typeof value !== 'string') {
					return value;
				}

				new Date(value).toLocaleDateString();
			},
		},
		{
			accessorKey: 'supplier.name',
			header: locale.he.supplier,
		},
	];
	const onGlobalFilter: ChangeEventHandler<HTMLInputElement> =
		useCallback((e) => setGlobalFilter(e.target.value), []);
	const table = useReactTable({
		columns,
		data: orders,
		getCoreRowModel: getCoreRowModel(),
		onSortingChange: setSorting,
		onGlobalFilterChange: setGlobalFilter,
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onRowSelectionChange: setRowSelection,
		autoResetPageIndex,
		enableSortingRemoval: false,
		globalFilterFn: fuzzyFilter,
		initialState: {
			pagination: {
				pageSize: 50,
			},
		},
		state: {
			rowSelection,
			sorting,
			globalFilter,
		},
	});

	return {
		table,
		globalFilter,
		onGlobalFilter,
		sorting,
		setSorting,
		rowSelection,
		setRowSelection,
		autoResetPageIndex,
		skipAutoResetPageIndex,
	};
};

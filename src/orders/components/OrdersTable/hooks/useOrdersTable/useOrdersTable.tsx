import {
	TOrderGetAllOutput,
	TOrderGetByIdOutput,
} from '../../../../../common/types';
import { ChangeEventHandler, useCallback, useState } from 'react';
import { useSkipper } from '../../../../../common/hooks/useSkipper/useSkipper';
import {
	ColumnDef,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	RowSelectionState,
	SortingState,
} from '@tanstack/table-core';
import { IndeterminateCheckbox } from '../../../../../common/components/atoms/IndeterminateCheckbox/IndeterminateCheckbox';
import { locale } from '../../../../../common/translations';
import { useReactTable } from '@tanstack/react-table';
import { buildFuzzyFilter } from '../../../../../common/utils/build-fuzzy-filter/build-fuzzy-filter';
import { ViewPDFButton } from './ViewPDFButton/ViewPDFButton';
import { isInstanceOfDate } from '../../../../common/utils/is-instance-of-date/is-instance-of-date';

export const useOrdersTable = (
	orders: TOrderGetAllOutput,
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
	const columns: Array<ColumnDef<TOrderGetByIdOutput>> = [
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
				<div className={`pl-2`}>
					<IndeterminateCheckbox
						{...{
							checked: row.getIsSelected(),
							indeterminate: row.getIsSomeSelected(),
							onChange: row.getToggleSelectedHandler(),
						}}
					/>
				</div>
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

				if (!isInstanceOfDate(value)) {
					return value;
				}

				return new Date(value).toLocaleDateString();
			},
		},
		{
			accessorKey: 'supplier.name',
			header: locale.he.supplier,
		},
		{
			accessorKey: 'rowIndex',
			header: '',
			cell: ({ cell }) => (
				<strong>{cell.getValue() as number}</strong>
			),
		},
	];
	const onGlobalFilter: ChangeEventHandler<HTMLInputElement> =
		useCallback(
			(e) => {
				if (e.target.value === globalFilter) return;

				setGlobalFilter(e.target.value);
			},
			[globalFilter, setGlobalFilter],
		);
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
		globalFilterFn: buildFuzzyFilter(),
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

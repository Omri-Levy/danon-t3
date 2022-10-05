import {
	SupplierGetAllOutput,
	SupplierGetByIdOutput,
	SupplierUpdateByIdOutput,
} from '../../../../../../types';
import { ChangeEventHandler, useCallback, useState } from 'react';
import { useSkipper } from '../../../../../../hooks/useSkipper/useSkipper';
import {
	ColumnDef,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	RowData,
	RowSelectionState,
	SortingState,
	Table,
} from '@tanstack/table-core';
import { useUpdateSupplierById } from '../../../../../../api/suppliers-api';
import { IndeterminateCheckbox } from '../../../../../atoms/IndeterminateCheckbox/IndeterminateCheckbox';
import { locale } from '../../../../../../translations';
import { DefaultCell } from '../../../../../atoms/DefaultCell/DefaultCell';
import { updateSupplierSchema } from '../../../../../../server/suppliers/validation';
import { toast } from 'react-hot-toast';
import { useReactTable } from '@tanstack/react-table';
import { fuzzyFilter } from '../../../../../../utils/fuzzy-filter/fuzzy-filter';

declare module '@tanstack/react-table' {
	interface TableMeta<TData extends RowData> {
		updateData: (
			rowIndex: number,
			columnId: string,
			value: unknown,
		) => void;
		format: (
			rowIndex: number,
			columnId: string,
			table: Table<TData>,
		) =>
			| {
					type: 'number';
					min: number;
					step: number;
					className: 'text-left';
					dir: 'rtl';
			  }
			| {
					type: 'number';
					min: number;
					className: 'text-left';
					dir: 'rtl';
			  }
			| {
					type: 'text';
					className?: string;
			  };
	}
}

export const useSuppliersTable = (
	suppliers: SupplierGetAllOutput,
) => {
	const [globalFilter, setGlobalFilter] = useState('');
	const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();
	const [sorting, setSorting] = useState<SortingState>([
		{ id: 'name', desc: false },
	]);
	const [rowSelection, setRowSelection] =
		useState<RowSelectionState>({});
	const { onUpdateById } = useUpdateSupplierById();
	const columns: Array<ColumnDef<SupplierGetByIdOutput>> = [
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
			accessorKey: 'email',
			header: locale.he.email,
		},
		{
			accessorKey: 'name',
			header: locale.he.name,
		},
	];
	const defaultColumn = {
		cell: DefaultCell,
	};
	const onGlobalFilter: ChangeEventHandler<HTMLInputElement> =
		useCallback((e) => setGlobalFilter(e.target.value), []);
	const updateData = useCallback(
		async (rowIndex: number, columnId: string, value: any) => {
			// Skip page index reset until after next rerender
			skipAutoResetPageIndex();

			const prevSupplier = suppliers?.[rowIndex];

			if (!prevSupplier) return;

			const result = updateSupplierSchema
				.pick({ [columnId]: true })
				.safeParse({
					[columnId]: value,
				});

			if (!result.success) {
				const error = result.error.errors
					.map(({ message }) => message)
					.join('\n');

				toast.error(`${locale.he.actions.error} ${error}`);

				return;
			}

			await onUpdateById({
				[columnId]: value,
				id: prevSupplier?.id,
			});
		},
		[suppliers?.length, skipAutoResetPageIndex, onUpdateById],
	);
	const format = useCallback(
		(
			rowIndex: number,
			columnId: string,
			table: Table<SupplierUpdateByIdOutput>,
		) => ({ type: 'text' }),
		[],
	);
	const table = useReactTable({
		columns,
		data: suppliers,
		getCoreRowModel: getCoreRowModel(),
		defaultColumn,
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
		}, // Provide our updateData function to our table meta
		meta: {
			updateData,
			format,
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

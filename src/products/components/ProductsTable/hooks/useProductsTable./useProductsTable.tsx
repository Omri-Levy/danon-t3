import {
	TProductGetAllOutput,
	TProductGetByIdOutput,
} from '../../../../../common/types';
import { ChangeEvent, useCallback, useState } from 'react';
import { useSkipper } from '../../../../../common/hooks/useSkipper/useSkipper';
import {
	ColumnDef,
	createColumnHelper,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	RowData,
	RowSelectionState,
	SortingState,
	Table,
} from '@tanstack/table-core';
import { useGetAllSupplierNames } from '../../../../../suppliers/suppliers.api';
import { useUpdateProductById } from '../../../../products.api';
import { IndeterminateCheckbox } from '../../../../../common/components/atoms/IndeterminateCheckbox/IndeterminateCheckbox';
import { locale } from '../../../../../common/translations';
import { SelectColumn } from '../../../../../common/components/atoms/SelectColumn/SelectColumn';
import { Unit } from '../../../../../common/enums';
import { DefaultCell } from '../../../../../common/components/atoms/DefaultCell/DefaultCell';
import {
	productIdSchema,
	updateProductSchema,
} from '../../../../validation';
import { toast } from 'react-hot-toast';
import { useReactTable } from '@tanstack/react-table';
import { buildFuzzyFilter } from '../../../../../common/utils/build-fuzzy-filter/build-fuzzy-filter';
import { zSupplierNamesEnum } from '../../../../../suppliers/utils/z-supplier-names-enum/z-supplier-names-enum';

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

export const columnHelper =
	createColumnHelper<TProductGetByIdOutput>();
export const useProductsTable = (products: TProductGetAllOutput) => {
	const [globalFilter, setGlobalFilter] = useState('');
	const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();
	const [sorting, setSorting] = useState<SortingState>([
		{ id: 'name', desc: false },
	]);
	const [rowSelection, setRowSelection] =
		useState<RowSelectionState>({});
	const { supplierNames } = useGetAllSupplierNames();
	const { onUpdateById } = useUpdateProductById();
	const columns: Array<ColumnDef<TProductGetByIdOutput>> = [
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
			accessorKey: 'stock',
			header: locale.he.stock,
		},
		{
			accessorKey: 'orderAmount',
			header: locale.he.orderAmount,
		},
		{
			accessorKey: 'packageSize',
			header: locale.he.packageSize,
		},
		{
			accessorKey: 'unit',
			header: locale.he.unit,
			cell: (props) => (
				<SelectColumn
					options={Object.values(Unit)}
					{...props}
				/>
			),
		},
		{
			accessorKey: 'name',
			header: locale.he.productName,
		},
		{
			accessorKey: 'sku',
			header: locale.he.sku,
		},
		{
			accessorKey: 'supplier.name',
			header: locale.he.supplier,
			cell: (props) => (
				<SelectColumn
					options={supplierNames ?? []}
					{...props}
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
	];
	const defaultColumn = {
		cell: DefaultCell,
	};
	const onGlobalFilter = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			if (e.target.value === globalFilter) return;

			setGlobalFilter(e.target.value);
		},
		[globalFilter, setGlobalFilter],
	);
	// Checks supplier name as an enum instead of string.
	const runtimeSchema = updateProductSchema
		.setKey('supplier', zSupplierNamesEnum(supplierNames ?? []))
		.partial()
		.setKey('id', productIdSchema.shape.id);
	const updateData = useCallback(
		async (rowIndex: number, columnId: string, value: any) => {
			// Skip page index reset until after next rerender
			skipAutoResetPageIndex();

			const prevProduct = products?.[rowIndex];

			if (!prevProduct) return;

			const column =
				columnId === 'supplier_name' ? 'supplier' : columnId;
			const isNumeric = [
				'stock',
				'orderAmount',
				'packageSize',
			].some((col) => col === columnId);
			const result = runtimeSchema.safeParse({
				id: prevProduct.id,
				[column]: isNumeric ? parseFloat(value) : value,
			});

			if (!result.success) {
				const error = result.error.errors
					.map(({ message }) => message)
					.join('\n');

				toast.error(`${locale.he.actions.error} ${error}`);

				return;
			}

			const prevOrderAmount = prevProduct.orderAmount;
			const prevPackageSize = prevProduct.packageSize;
			const isOrderAmount = column === 'orderAmount';
			const isPackageSize = column === 'packageSize';
			const orderAmount = parseFloat(
				isOrderAmount ? value : prevOrderAmount,
			);
			const packageSize = parseFloat(
				isPackageSize ? value : prevPackageSize,
			);
			const isException =
				orderAmount === 0 || packageSize === 1;
			const isDivisible =
				Math.round(orderAmount % packageSize) === 0;
			const shouldUpdate = isException || isDivisible;

			if ((isOrderAmount || isPackageSize) && !shouldUpdate) {
				toast.error(locale.he.mustBeDivisibleBy);

				return;
			}

			await onUpdateById({
				...result.data,
				id: prevProduct.id,
			});
		},
		[onUpdateById, products?.length, skipAutoResetPageIndex],
	);
	const format = useCallback(
		(
			rowIndex: number,
			columnId: string,
			table: Table<TProductGetByIdOutput>,
		) =>
			['orderAmount', 'packageSize', 'stock'].some(
				(value) => value === columnId,
			)
				? {
						type: 'number',
						className: 'text-left',
						step:
							columnId === 'orderAmount'
								? table.getRow(rowIndex.toString())
										.original?.packageSize
								: undefined,
						min: 0,
						dir: 'rtl',
				  }
				: {
						type: 'text',
				  },
		[],
	);
	const table = useReactTable({
		columns,
		data: products,
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

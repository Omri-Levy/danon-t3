import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { DefaultCell } from '../components/atoms/DefaultCell/DefaultCell';
import type { NextPage } from 'next';
import Head from 'next/head';
import { ChangeEvent, FunctionComponent, useState } from 'react';
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
import { useReactTable } from '@tanstack/react-table';
import { locale } from '../translations';
import { SelectColumn } from '../components/atoms/SelectColumn/SelectColumn';
import { IndeterminateCheckbox } from '../components/atoms/IndeterminateCheckbox/IndeterminateCheckbox';
import { useSkipper } from '../hooks/useSkipper/useSkipper';
import { fuzzyFilter } from '../utils/fuzzy-filter/fuzzy-filter';
import { TopBar } from '../components/molecules/TopBar/TopBar';
import { Pagination } from '../components/organisms/Pagination/Pagination';
import { ReactTable } from '../components/molecules/ReactTable/ReactTable';
import { createProductsApi } from '../api/products-api';
import { InferQueryOutput } from '../types';
import { updateProductSchema } from '../server/products/validation';
import { Unit } from '@prisma/client';
import { createSuppliersApi } from '../api/suppliers-api';
import { toast } from 'react-hot-toast';
import { trpc } from '../utils/trpc';
import Link from 'next/link';

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
	createColumnHelper<InferQueryOutput<'products.getById'>>();

export const useProductsTable = (
	products: InferQueryOutput<'products.getAll'>,
) => {
	const [globalFilter, setGlobalFilter] = useState('');
	const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();
	const [sorting, setSorting] = useState<SortingState>([
		{ id: 'name', desc: false },
	]);
	const [rowSelection, setRowSelection] =
		useState<RowSelectionState>({});
	const suppliersApi = createSuppliersApi();
	const { supplierNames } = suppliersApi.getAllSupplierNames();
	const productsApi = createProductsApi();
	const { onUpdateById } = productsApi.updateById();
	const columns: Array<
		ColumnDef<InferQueryOutput<'products.getById'>>
	> = [
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
	];
	const defaultColumn = {
		cell: DefaultCell,
	};
	const onGlobalFilter = (e: ChangeEvent<HTMLInputElement>) =>
		setGlobalFilter(e.target.value);
	const updateData = async (
		rowIndex: number,
		columnId: string,
		value: any,
	) => {
		// Skip page index reset until after next rerender
		skipAutoResetPageIndex();

		const prevProduct = products?.[rowIndex];

		if (!prevProduct) return;

		const column =
			columnId === 'supplier_name' ? 'supplier' : columnId;
		const valueAsNumber = Number(value);
		const parsedValue = [
			'orderAmount',
			'packageSize',
			'stock',
		].includes(column)
			? valueAsNumber
			: value;
		const isPackageSize = column === 'packageSize';

		const result = updateProductSchema
			.pick({ [column]: true })
			.safeParse({
				[column]: parsedValue,
			});

		if (!result.success) {
			const error = result.error.errors
				.map(({ message }) => message)
				.join('\n');

			toast.error(`${locale.he.actions.error} ${error}`);

			return;
		}

		// Make sure it is always possible to return to a package size of 1.
		if (isPackageSize && !prevProduct?.packageSize) {
			await onUpdateById({
				orderAmount: 0,
				[column]: parsedValue,
				id: {
					supplierId: prevProduct.supplierId,
					sku: prevProduct?.sku,
				},
			});

			return;
		}

		if (isPackageSize && parsedValue === 1) {
			await onUpdateById({
				[column]: parsedValue,
				supplierId: prevProduct.supplierId,
				id: {
					supplierId: prevProduct.supplierId,
					sku: prevProduct?.sku,
				},
			});

			return;
		}

		const prevPackageSize = prevProduct?.packageSize;
		const prevPackageSizeAsNumber = Number(prevPackageSize);
		const isException = prevPackageSizeAsNumber === 1;
		const isDivisible =
			Math.round(valueAsNumber % prevPackageSizeAsNumber) === 0;
		const isOrderAmountOrPackageSize = [
			'orderAmount',
			'packageSize',
		].includes(column);
		const shouldSkip =
			isOrderAmountOrPackageSize &&
			!isDivisible &&
			valueAsNumber > 0 &&
			!isException;

		if (shouldSkip) {
			toast.error(locale.he.mustBeDivisibleBy);

			return;
		}

		await onUpdateById({
			[column]: parsedValue,
			id: {
				supplierId: prevProduct.supplierId,
				sku: prevProduct?.sku,
			},
		});
	};
	const format = (
		rowIndex: number,
		columnId: string,
		table: Table<InferQueryOutput<'products.getById'>>,
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
			  };
	const table = useReactTable({
		columns,
		data: products ?? [],
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

export const ProductsTable: FunctionComponent<{
	table: Table<InferQueryOutput<'products.getById'>>;
}> = ({ table }) => (
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
				className={`sticky top-0 bg-neutral text-white`}
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
		renderCell={(cell, render) => (
			<td className={`padding-x-0`}>{render}</td>
		)}
		className={`table table-compact w-full`}
	/>
);

const Home: NextPage = () => {
	const suppliersApi = createSuppliersApi();
	const { supplierNames } = suppliersApi.getAllSupplierNames();
	const productsApi = createProductsApi();
	const { products, isLoading } = productsApi.getAll();
	const isMutating = trpc.useContext().queryClient.isMutating();
	const {
		table,
		globalFilter,
		onGlobalFilter,
		rowSelection,
		setRowSelection,
	} = useProductsTable(products);

	return (
		<div>
			<Head>
				<title>Danon Ordering System</title>
				<meta
					name='description'
					content='Generated by create-t3-app'
				/>
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<main className='container pt-[7vh] min-h-screen p-2 mx-auto relative'>
				{!!isMutating && (
					<svg
						xmlns='http://www.w3.org/2000/svg'
						fill='none'
						viewBox='0 0 24 24'
						strokeWidth={1.5}
						stroke='currentColor'
						className='w-6 h-6 animate-spin absolute bottom-5 left-5'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							d='M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99'
						/>
					</svg>
				)}
				{!supplierNames?.length && !isLoading && (
					<AlertDialog.Root defaultOpen open>
						<AlertDialog.Portal>
							<AlertDialog.Overlay />
							<div
								className={`modal modal-open`}
								dir={`rtl`}
							>
								<AlertDialog.Content
									className={`modal-box`}
								>
									<AlertDialog.Title
										className={`font-bold`}
									>
										{locale.he.attention}
									</AlertDialog.Title>
									<AlertDialog.Description>
										{locale.he.noSuppliers}
									</AlertDialog.Description>
									<div
										className={`flex justify-end mt-2`}
									>
										<AlertDialog.Action asChild>
											<Link
												href={'/suppliers'}
												passHref
											>
												<a className={`btn`}>
													{
														locale.he
															.navigateToSuppliers
													}
												</a>
											</Link>
										</AlertDialog.Action>
									</div>
								</AlertDialog.Content>
							</div>
						</AlertDialog.Portal>
					</AlertDialog.Root>
				)}
				<TopBar
					globalFilter={globalFilter}
					onGlobalFilter={onGlobalFilter}
					rowSelection={rowSelection}
					setRowSelection={setRowSelection}
					productsCount={table
						.getPreFilteredRowModel()
						?.rows.length?.toString()}
				/>
				<div className={`overflow-auto h-[78vh]`}>
					{!isLoading && <ProductsTable table={table} />}
				</div>
				{!!products?.length && <Pagination table={table} />}
			</main>
		</div>
	);
};

export default Home;

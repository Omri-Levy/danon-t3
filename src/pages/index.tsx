import { DefaultCell } from '../components/atoms/DefaultCell/DefaultCell';
import type { NextPage } from 'next';
import Head from 'next/head';
import { ChangeEvent, useState } from 'react';
import {
	ColumnDef,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	RowData,
	RowSelectionState,
	SortingState,
} from '@tanstack/table-core';
import { useReactTable } from '@tanstack/react-table';
import { locale } from '../translations';
import { SelectColumn } from '../components/atoms/SelectColumn/SelectColumn';
import { IndeterminateCheckbox } from '../components/atoms/IndeterminateCheckbox/IndeterminateCheckbox';
import { useToggle } from 'react-use';
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
import { formatErrors } from '../env/client.mjs';

declare module '@tanstack/react-table' {
	interface TableMeta<TData extends RowData> {
		updateData: (
			rowIndex: number,
			columnId: string,
			value: unknown,
		) => void;
	}
}

const Home: NextPage = () => {
	const suppliersApi = createSuppliersApi();
	const { supplierNames } = suppliersApi.getAllSupplierNames();
	const [sorting, setSorting] = useState<SortingState>([
		{ id: 'name', desc: false },
	]);
	const [rowSelection, setRowSelection] =
		useState<RowSelectionState>({});
	const [globalFilter, setGlobalFilter] = useState('');
	const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();
	const [isSendingOrder, toggleIsSendingOrder] = useToggle(false);
	const [isPrinting, toggleIsPrinting] = useToggle(false);
	const [isCreatingProduct, toggleIsCreatingProduct] =
		useToggle(false);
	const productsApi = createProductsApi();
	const { products, isLoading } = productsApi.getAll();
	const { onUpdateById } = productsApi.updateById();
	const { onDeleteByIds } =
		productsApi.deleteByIds<Record<PropertyKey, boolean>>(
			setRowSelection,
		);
	const { onResetOrderAmount } = productsApi.resetOrderAmount();
	const isValidToOrder = productsApi.isValidToOrder();
	const columns: Array<
		ColumnDef<
			Exclude<InferQueryOutput<'products.getById'>, undefined>
		>
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
	const defaultColumn: Partial<
		ColumnDef<
			Exclude<InferQueryOutput<'products.getById'>, undefined>
		>
	> = {
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
			const error = formatErrors(result.error.format());

			toast.error(`${locale.he.actions.error} ${error}`);

			return;
		}

		// Make sure it is always possible to return to a package size of 1.
		if (isPackageSize && !prevProduct?.packageSize) {
			await onUpdateById({
				orderAmount: 0,
				[column]: parsedValue,
				id: prevProduct?.id,
			});

			return;
		}

		if (isPackageSize && parsedValue === 1) {
			await onUpdateById({
				[column]: parsedValue,
				id: prevProduct?.id,
			});

			return;
		}

		const prevPackageSize = prevProduct?.packageSize;
		const prevPackageSizeAsNumber = Number(prevPackageSize);
		const isException = prevPackageSizeAsNumber === 1;
		const isDivisible =
			valueAsNumber % prevPackageSizeAsNumber === 0;
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
			id: prevProduct?.id,
		});
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
		},
	});
	// const printColumns = useReactTableToAutoTable(table, blacklist);
	// const printBody = table
	// 	.getSortedRowModel()
	// 	.rows.filter((r) => !isBlacklisted(r.id, blacklist))
	// 	.map((r, index) => addRowIndex(r.original, index));
	const onDeleteSelectedProductsSubmit = async () => {
		const productsToDelete = products
			?.filter((_, index) => rowSelection[index])
			.map(({ id }) => id);

		if (!productsToDelete?.length) return;

		await onDeleteByIds({
			ids: productsToDelete,
		});
	};
	const { products: productsToOrder } =
		productsApi.getAllForOrder();
	const moreThanOneSupplier =
		new Set(productsToOrder?.map(({ supplierId }) => supplierId))
			.size > 1;
	const isMutating = trpc.useContext().queryClient.isMutating();

	if (isLoading) return null;

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
				<TopBar
					moreThanOneSupplier={moreThanOneSupplier}
					onResetOrderAmount={() => onResetOrderAmount()}
					onDeleteSelectedProducts={
						onDeleteSelectedProductsSubmit
					}
					globalFilter={globalFilter}
					onGlobalFilter={onGlobalFilter}
					productsLength={products?.length}
					rowSelectionLength={
						Object.keys(rowSelection)?.length
					}
					toggleIsCreatingProduct={toggleIsCreatingProduct}
					isCreatingProduct={isCreatingProduct}
					isPrinting={isPrinting}
					isSendingOrder={isSendingOrder}
					toggleIsPrinting={toggleIsPrinting}
					toggleIsSendingOrder={toggleIsSendingOrder}
					orderAtleastOne={isValidToOrder}
					productsCount={table
						.getPreFilteredRowModel()
						?.rows.length?.toString()}
				/>
				<div className={`overflow-auto h-[78vh]`}>
					<ReactTable
						table={table}
						HeadRow={({
							children,
							headerGroup,
							...props
						}) => <tr {...props}>{children}</tr>}
						BodyRow={({ children, ...props }) => (
							<tr className={`hover`} {...props}>
								{children}
							</tr>
						)}
						renderHeader={(header, render) => (
							<th
								align={
									header.id === 'select'
										? undefined
										: 'center'
								}
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
							<td className={`padding-x-0`}>
								{render}
							</td>
						)}
						className={`table table-compact w-full`}
					/>
				</div>
				{!!products?.length && <Pagination table={table} />}
			</main>
		</div>
	);
};

export default Home;

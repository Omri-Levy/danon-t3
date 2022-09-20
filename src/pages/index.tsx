import { DefaultCell } from '../components/atoms/DefaultCell/DefaultCell';
import 'jspdf-autotable';
import type { NextPage } from 'next';
import Head from 'next/head';
import { ChangeEvent, useEffect, useState } from 'react';
import {
	ColumnDef,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	RowSelectionState,
	SortingState,
} from '@tanstack/table-core';
import { useReactTable } from '@tanstack/react-table';
import { locale } from '../translations';
import { UnitColumn } from '../components/atoms/UnitColumn/UnitColumn';
import { IndeterminateCheckbox } from '../components/atoms/IndeterminateCheckbox/IndeterminateCheckbox';
import { useToggle } from '../hooks/useToggle/useToggle';
import { useSkipper } from '../hooks/useSkipper/useSkipper';
import { fuzzyFilter } from '../utils/fuzzy-filter/fuzzy-filter';
import { CreateProductModal } from '../components/organisms/CreateProductModal/CreateProductModal';
import { Toast } from '../components/molecules/Toast/Toast';
import { PrintModal } from '../components/organisms/PrintModal/PrintModal';
import { TopBar } from '../components/molecules/TopBar/TopBar';
import { SendOrderModal } from '../components/organisms/SendOrderModal/SendOrderModal';
import { CreateSupplierModal } from '../components/organisms/CreateSupplierModal/CreateSupplierModal';
import { Pagination } from '../components/organisms/Pagination/Pagination';
import { ReactTable } from '../components/molecules/ReactTable/ReactTable';
import { ProductModel } from '../validation';
import { createProductsApi } from '../api/products-api';
import { InferQueryOutput } from '../types';

const Home: NextPage = () => {
	const [sorting, setSorting] = useState<SortingState>([
		{ id: 'name', desc: false },
	]);
	const [rowSelection, setRowSelection] =
		useState<RowSelectionState>({});
	const [globalFilter, setGlobalFilter] = useState('');
	const [toast, setToast] = useState<{
		message: string;
		type: 'success' | 'error' | 'warning' | 'info';
	}>({
		message: '',
		type: 'success',
	});
	const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();
	const [
		isSendingOrder,
		,
		toggleOnIsSendingOrder,
		toggleOffIsSendingOrder,
	] = useToggle();
	const [isPrinting, , toggleOnIsPrinting, toggleOffIsPrinting] =
		useToggle();
	const [
		isCreatingProduct,
		,
		toggleOnIsCreatingProduct,
		toggleOffIsCreatingProduct,
	] = useToggle();
	const [
		isCreatingSupplier,
		,
		toggleOnIsCreatingSupplier,
		toggleOffIsCreatingSupplier,
	] = useToggle();
	const productsApi = createProductsApi();
	const { products, isLoading, refetch } = productsApi.getAll();
	const { onUpdateById } = productsApi.updateById();
	const { onDeleteByIds } = productsApi.deleteByIds();
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
				<IndeterminateCheckbox
					{...{
						checked: table.getIsAllRowsSelected(),
						indeterminate: table.getIsSomeRowsSelected(),
						onChange:
							table.getToggleAllRowsSelectedHandler(),
					}}
				/>
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
			cell: UnitColumn,
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

		const valueAsNumber = Number(value);
		const parsedValue = [
			'orderAmount',
			'packageSize',
			'stock',
		].includes(columnId)
			? valueAsNumber
			: value;
		const isPackageSize = columnId === 'packageSize';

		ProductModel.pick({ [columnId]: true }).parse({
			[columnId]: parsedValue,
		});

		// Make sure it is always possible to return to a package size of 1.
		if (isPackageSize && !prevProduct?.packageSize) {
			await onUpdateById({
				orderAmount: 0,
				[columnId]: parsedValue,
				id: prevProduct?.id,
			});
			await refetch();

			return;
		}

		if (isPackageSize && parsedValue === 1) {
			await onUpdateById({
				[columnId]: parsedValue,
				id: prevProduct?.id,
			});
			await refetch();

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
		].includes(columnId);
		const shouldSkip =
			isOrderAmountOrPackageSize &&
			!isDivisible &&
			valueAsNumber > 0 &&
			!isException;

		if (shouldSkip) {
			setToast({
				message: locale.he.mustBeDivisibleBy,
				type: 'error',
			});

			return;
		}

		await onUpdateById({
			[columnId]: parsedValue,
			id: prevProduct?.id,
		});

		await refetch();
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
		await refetch();
		setRowSelection({});
	};

	useEffect(() => {
		if (!toast?.message) return;

		setTimeout(() => {
			setToast({
				message: '',
				type: 'success',
			});
		}, 2000);
	}, [toast?.message]);

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
			<Toast message={toast?.message} type={toast?.type} />
			<SendOrderModal
				isOpen={isSendingOrder}
				onClose={toggleOffIsSendingOrder}
			/>
			<PrintModal
				isOpen={isPrinting}
				onClose={toggleOffIsPrinting}
			/>
			<CreateSupplierModal
				isOpen={isCreatingSupplier}
				onClose={toggleOffIsCreatingSupplier}
			/>
			<CreateProductModal
				isOpen={isCreatingProduct}
				onClose={toggleOffIsCreatingProduct}
			/>
			<main className='container pt-[7vh] min-h-screen p-2 mx-auto'>
				<TopBar
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
					toggleOnIsCreatingProduct={
						toggleOnIsCreatingProduct
					}
					toggleOnIsCreatingSupplier={
						toggleOnIsCreatingSupplier
					}
					toggleOnIsPrinting={toggleOnIsPrinting}
					toggleOnIsSendingOrder={toggleOnIsSendingOrder}
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

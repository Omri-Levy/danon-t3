import { NextPage } from 'next';
import Head from 'next/head';
import { createSuppliersApi } from '../api/suppliers-api';
import { useToggle } from 'react-use';
import { CreateSupplierModal } from '../components/organisms/CreateSupplierModal/CreateSupplierModal';
import { ChangeEvent, FunctionComponent, useState } from 'react';
import { locale } from '../translations';
import { updateSupplierSchema } from '../server/suppliers/validation';
import Link from 'next/link';
import clsx from 'clsx';
import { trpc } from '../utils/trpc';
import { toast } from 'react-hot-toast';
import {
	ColumnDef,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	RowSelectionState,
	SortingState,
	Table,
} from '@tanstack/table-core';
import { InferQueryOutput } from '../types';
import { ReactTable } from '../components/molecules/ReactTable/ReactTable';
import { useSkipper } from '../hooks/useSkipper/useSkipper';
import { IndeterminateCheckbox } from '../components/atoms/IndeterminateCheckbox/IndeterminateCheckbox';
import { DefaultCell } from '../components/atoms/DefaultCell/DefaultCell';
import { useReactTable } from '@tanstack/react-table';
import { fuzzyFilter } from '../utils/fuzzy-filter/fuzzy-filter';
import { Pagination } from '../components/organisms/Pagination/Pagination';
import { signOut, useSession } from 'next-auth/react';

export const SuppliersTable: FunctionComponent<{
	table: Table<InferQueryOutput<'suppliers.getById'>>;
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

export const useSuppliersTable = (
	suppliers: InferQueryOutput<'suppliers.getAll'>,
) => {
	const [globalFilter, setGlobalFilter] = useState('');
	const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();
	const [sorting, setSorting] = useState<SortingState>([
		{ id: 'name', desc: false },
	]);
	const [rowSelection, setRowSelection] =
		useState<RowSelectionState>({});
	const suppliersApi = createSuppliersApi();
	const { onUpdateById } = suppliersApi.updateById();
	const columns: Array<
		ColumnDef<InferQueryOutput<'suppliers.getById'>>
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
	const onGlobalFilter = (e: ChangeEvent<HTMLInputElement>) =>
		setGlobalFilter(e.target.value);
	const updateData = async (
		rowIndex: number,
		columnId: string,
		value: any,
	) => {
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
	};
	const format = (
		rowIndex: number,
		columnId: string,
		table: Table<InferQueryOutput<'suppliers.getById'>>,
	) => ({ type: 'text' });
	const table = useReactTable({
		columns,
		data: suppliers ?? [],
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

const Suppliers: NextPage = () => {
	const suppliersApi = createSuppliersApi();
	const { suppliers, isLoading } = suppliersApi.getAll();
	const suppliersCount = suppliers?.length ?? 0;
	const {
		table,
		rowSelection,
		setRowSelection,
		globalFilter,
		onGlobalFilter,
	} = useSuppliersTable(suppliers);
	const [isOpen, toggleIsOpen] = useToggle(false);
	const selectedSuppliers = suppliers
		?.filter((_, index) => rowSelection[index])
		.map(({ id }) => id);
	const { onDeleteByIds, isLoading: isLoadingDeleteByIds } =
		suppliersApi.deleteByIds<Record<PropertyKey, boolean>>(
			setRowSelection,
		);
	const onDeleteSelectedSuppliers = () => {
		if (!selectedSuppliers?.length) return;

		onDeleteByIds({
			ids: selectedSuppliers,
		});
	};
	const isMutating = trpc.useContext().queryClient.isMutating();
	const { status } = useSession();
	const isLoadingSession = status === 'loading';
	const onSignOut = () => signOut();

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
			<main className='container pt-[7vh] min-h-screen p-2 mx-auto'>
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
				<div className={`flex justify-between mb-2`}>
					<div className={`space-x-2`}>
						<Link href={'/orders'} passHref>
							<a className={'btn'}>
								{locale.he.orders}
							</a>
						</Link>
						<Link href={'/'} passHref>
							<a className={'btn'}>
								{locale.he.products}
							</a>
						</Link>
						<CreateSupplierModal
							isOpen={isOpen}
							onOpen={toggleIsOpen}
						/>
						<button
							disabled={
								!suppliers?.length ||
								!selectedSuppliers?.length ||
								isLoadingDeleteByIds
							}
							className={clsx([
								'btn',
								{ loading: isLoadingDeleteByIds },
							])}
							onClick={onDeleteSelectedSuppliers}
						>
							{locale.he.delete}
						</button>
					</div>
					<div className={`flex space-x-2 items-center`}>
						<div className='form-control'>
							<div className='input-group'>
								<input
									type='text'
									dir={`rtl`}
									placeholder={locale.he.search
										.replace('$1', suppliersCount)
										.replace('$2', 'ספקים')}
									className='input input-bordered'
									value={globalFilter ?? ''}
									onChange={onGlobalFilter}
								/>
								<div className='btn btn-square cursor-auto hover:bg-neutral'>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										className='h-6 w-6'
										fill='none'
										viewBox='0 0 24 24'
										stroke='currentColor'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth='2'
											d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
										/>
									</svg>
								</div>
							</div>
						</div>
						<button
							className={clsx([
								`btn`,
								{ loading: isLoadingSession },
							])}
							onClick={onSignOut}
						>
							{locale.he.signOut}
						</button>
					</div>
				</div>
				<div className={`overflow-auto h-[78vh]`}>
					{!isLoading && <SuppliersTable table={table} />}
				</div>
				{!!suppliers?.length && <Pagination table={table} />}
			</main>
		</div>
	);
};

export default Suppliers;

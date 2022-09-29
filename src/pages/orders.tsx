import { NextPage } from 'next';
import Head from 'next/head';
import { trpc } from '../utils/trpc';
import { Pagination } from '../components/organisms/Pagination/Pagination';
import { createOrdersApi } from '../api/orders-api';
import { InferQueryOutput } from '../types';
import { ChangeEvent, FunctionComponent, useState } from 'react';
import { useSkipper } from '../hooks/useSkipper/useSkipper';
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
import { IndeterminateCheckbox } from '../components/atoms/IndeterminateCheckbox/IndeterminateCheckbox';
import { locale } from '../translations';
import { useReactTable } from '@tanstack/react-table';
import { fuzzyFilter } from '../utils/fuzzy-filter/fuzzy-filter';
import { ReactTable } from '../components/molecules/ReactTable/ReactTable';
import Link from 'next/link';
import clsx from 'clsx';
import { signOut, useSession } from 'next-auth/react';
import * as Dialog from '@radix-ui/react-dialog';
import { useToggle } from 'react-use';

export const ViewPDF = ({
	presignedUrl,
	isOpen,
	onOpen,
}: {
	presignedUrl: string;
	isOpen: boolean;
	onOpen: (nextValue?: boolean) => void;
}) => {
	return (
		<Dialog.Root open={isOpen} onOpenChange={onOpen}>
			<Dialog.Portal>
				<Dialog.Overlay>
					<div
						className={clsx([
							`modal`,
							{
								[`modal-open`]: isOpen,
							},
						])}
					>
						<Dialog.Content
							className={`modal-box w-6/12 max-w-none h-full max-h-none`}
						>
							<div className={`flex justify-end`}>
								<Dialog.Close>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										viewBox='0 0 24 24'
										fill='currentColor'
										className='w-6 h-6'
									>
										<path
											fillRule='evenodd'
											d='M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z'
											clipRule='evenodd'
										/>
									</svg>
								</Dialog.Close>
							</div>
							<Dialog.Title
								dir={`rtl`}
								className={`font-bold text-center`}
							>
								{locale.he.order}
							</Dialog.Title>
							<iframe
								className={`w-full h-[94%]`}
								src={presignedUrl}
							/>
						</Dialog.Content>
					</div>
				</Dialog.Overlay>
			</Dialog.Portal>
		</Dialog.Root>
	);
};

export const useOrdersTable = (
	orders: InferQueryOutput<'orders.getAll'>,
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
	const columns: Array<
		ColumnDef<InferQueryOutput<'orders.getById'>>
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
			header: locale.he.pdf,
			cell: (props) => {
				const id = orders?.[props?.row?.index]?.id ?? '';

				return (
					<button
						className={`btn btn-ghost`}
						onClick={() => {
							onIdChange(id);
							onOpen();
						}}
					>
						{locale.he.view}
					</button>
				);
			},
		},
		{
			accessorKey: 'orderNumber',
			header: locale.he.orderNumber,
			cell: ({ cell }) =>
				cell.getValue()?.toString().padStart(5, '0'),
		},
		{
			accessorKey: 'createdAt',
			header: locale.he.createdAt,
			cell: ({ cell }) =>
				new Date(cell.getValue()).toLocaleDateString(),
		},
		{
			accessorKey: 'supplier.name',
			header: locale.he.supplier,
		},
	];
	const onGlobalFilter = (e: ChangeEvent<HTMLInputElement>) =>
		setGlobalFilter(e.target.value);
	const table = useReactTable({
		columns,
		data: orders ?? [],
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

export const OrdersTable: FunctionComponent<{
	table: Table<InferQueryOutput<'orders.getById'>>;
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

const Orders: NextPage = () => {
	const [isOpen, onOpen] = useToggle(false);
	const ordersApi = createOrdersApi();
	const { orders, isLoading } = ordersApi.getAll();
	const [id, setId] = useState('');
	const onIdChange = (id: string) => setId(id);
	const { data: presignedUrl } = ordersApi.getPresignedUrlById({
		id,
		enabled: !!id && isOpen,
	});
	const {
		table,
		globalFilter,
		onGlobalFilter,
		rowSelection,
		setRowSelection,
	} = useOrdersTable(orders, onIdChange, onOpen);
	const { onDeleteByIds, isLoading: isLoadingDeleteByIds } =
		ordersApi.deleteByIds<Record<PropertyKey, boolean>>(
			setRowSelection,
		);
	const isMutating = trpc.useContext().queryClient.isMutating();
	const { status } = useSession();
	const isLoadingSession = status === 'loading';
	const ordersCount = orders?.length ?? 0;
	const onSignOut = () => signOut();
	const selectedOrders = orders
		?.filter((_, index) => rowSelection[index])
		.map(({ id }) => id);
	const onDeleteSelectedOrders = async () => {
		if (!selectedOrders?.length) return;

		await onDeleteByIds({
			ids: selectedOrders,
		});
	};
	const disableDelete =
		!orders?.length || !Object.keys(rowSelection)?.length;

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
				<ViewPDF
					presignedUrl={presignedUrl}
					isOpen={isOpen}
					onOpen={onOpen}
				/>
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
				<div className={`flex justify-between mb-1`}>
					<div className={`space-x-2 flex items-center`}>
						<div
							className={
								disableDelete ? `tooltip` : `inline`
							}
							data-tip={`לא ניתן לבצע מחיקת מוצרים עם 0 מוצרים מסומנים`}
						>
							<button
								disabled={disableDelete}
								className={clsx([
									`btn`,
									{ loading: isLoadingDeleteByIds },
								])}
								onClick={onDeleteSelectedOrders}
							>
								{locale.he.delete}
							</button>
						</div>
						<Link href={'/'} passHref>
							<a className={'btn'}>
								{locale.he.products}
							</a>
						</Link>
						<Link href={'/suppliers'} passHref>
							<a className={'btn'}>
								{locale.he.suppliers}
							</a>
						</Link>
					</div>
					<div className={`flex space-x-2 items-center`}>
						<div className='form-control'>
							<div className='input-group'>
								<input
									type='text'
									dir={`rtl`}
									placeholder={locale.he.search
										.replace('$1', ordersCount)
										.replace('$2', 'הזמנות')}
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
					{!isLoading && <OrdersTable table={table} />}
				</div>
				{!!orders?.length && <Pagination table={table} />}
			</main>
		</div>
	);
};

export default Orders;

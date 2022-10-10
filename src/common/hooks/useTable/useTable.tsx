import { TableOptions, useReactTable } from '@tanstack/react-table';
import {
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	RowData,
	RowSelectionState,
	SortingState,
} from '@tanstack/table-core';
import { buildFuzzyFilter } from '../../utils/build-fuzzy-filter/build-fuzzy-filter';
import {
	ChangeEventHandler,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from 'react';
import { useSkipper } from '../useSkipper/useSkipper';
import { useSearchParams } from 'react-router-dom';
import { camelCase, snakeCase } from 'lodash';
import { addRowIndex } from '../../utils/add-row-index/add-row-index';
import { IndeterminateCheckbox } from '../../components/atoms/IndeterminateCheckbox/IndeterminateCheckbox';
import { locale } from '../../translations';

export interface ISearchParams {
	search: string;
	sort_by: string;
	sort_dir: string;
	cursor: string;
	limit: string;
}

const i = 1;
export const isInstanceOfFunction = (value: any): value is Function =>
	value instanceof Function;

export const useTable = <TData extends RowData>({
	columns,
	data,
	initialSorting,
	...options
}: Omit<
	TableOptions<TData> & {
		updateData?: (
			skipAutoResetPageIndex: () => void,
		) => (
			rowIndex: number,
			columnId: string,
			value: unknown,
		) => void;
	},
	'getCoreRowModel'
> & {
	initialSorting?: SortingState;
}) => {
	const [searchParams, setSearchParams] = useSearchParams();
	const {
		search = '',
		sort_by = '',
		sort_dir = '',
		cursor = '',
		limit = '',
	} = Object.fromEntries(
		searchParams.entries(),
	) as unknown as ISearchParams;
	const camelCasedSortBy = camelCase(sort_by);
	const [globalFilter, setGlobalFilter] = useState(search ?? '');
	const onSearchParams = useCallback(
		(params: Partial<ISearchParams>) => {
			setSearchParams(() => ({
				search,
				sort_by,
				sort_dir,
				cursor,
				limit,
				...params,
			}));
		},
		[setSearchParams, search, sort_by, sort_dir, cursor, limit],
	);
	const isDesc = sort_dir === 'desc';
	const onGlobalFilter: ChangeEventHandler<HTMLInputElement> =
		useCallback(
			(e) => {
				setGlobalFilter(e.target.value);
				onSearchParams({
					search: e.target.value,
				});
			},
			[onSearchParams, globalFilter, setGlobalFilter],
		);
	const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();
	const [sorting, setSorting] = useState<SortingState>([
		{
			id:
				camelCasedSortBy === ''
					? initialSorting?.[0]?.id ?? 'id'
					: camelCasedSortBy,
			desc:
				sort_dir === ''
					? initialSorting?.[0]?.desc ?? false
					: !isDesc,
		},
	]);
	const [rowSelection, setRowSelection] =
		useState<RowSelectionState>({});
	const withRowIndex = useMemo(
		() => data?.map(addRowIndex),
		[data?.length],
	);
	const updateSortSearchParams = useCallback(
		(old: SortingState) => {
			const currentSort = old.at(0);

			onSearchParams({
				sort_by: snakeCase(currentSort?.id),
				sort_dir: currentSort?.desc ? 'asc' : 'desc',
			});
		},
		[onSearchParams],
	);
	const table = useReactTable({
		columns: [
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
								indeterminate:
									row.getIsSomeSelected(),
								onChange:
									row.getToggleSelectedHandler(),
							}}
						/>
					</div>
				),
			},
			...columns,
			{
				accessorKey: 'rowIndex',
				header: locale.he.row,
				cell: ({ cell }) => (
					<strong>{cell.getValue() as number}</strong>
				),
			},
		],
		data: withRowIndex,
		getCoreRowModel: getCoreRowModel(),
		onSortingChange: (updaterOrValue) => {
			setSorting(updaterOrValue);

			if (!isInstanceOfFunction(updaterOrValue)) return;

			updateSortSearchParams(updaterOrValue(sorting));
		},
		onGlobalFilterChange: setGlobalFilter,
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onRowSelectionChange: setRowSelection,
		autoResetPageIndex,
		enableSortingRemoval: false,
		sortDescFirst: true,
		globalFilterFn: buildFuzzyFilter(),
		state: {
			rowSelection,
			sorting,
			globalFilter,
		},
		meta: {
			...options?.meta,
			updateData: options?.updateData?.(skipAutoResetPageIndex),
		},
		initialState: {
			pagination: {
				pageSize: limit ? Number(limit) : undefined,
				pageIndex: cursor ? Number(cursor) - 1 : undefined,
				...options?.initialState?.pagination,
			},
			...options?.initialState,
		},
		...options,
	});
	const pageIndex = table.getState().pagination.pageIndex;
	const pageSize = table.getState().pagination.pageSize;
	const updatePaginationSearchParams = useCallback(() => {
		onSearchParams({
			cursor: Math.max(pageIndex + 1, 1).toString(),
			limit: Math.max(pageSize, 1).toString(),
		});
	}, [onSearchParams, pageIndex, pageSize]);

	useEffect(() => {
		updatePaginationSearchParams();
	}, [updatePaginationSearchParams]);

	return {
		table,
		globalFilter,
		setGlobalFilter,
		onGlobalFilter,
		autoResetPageIndex,
		skipAutoResetPageIndex,
		sorting,
		setSorting,
		rowSelection,
		setRowSelection,
	};
};

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
import { camelCase, snakeCase } from 'lodash';
import { IndeterminateCheckbox } from '../../components/atoms/IndeterminateCheckbox/IndeterminateCheckbox';
import { locale } from '../../translations';
import { addRowIndex } from '../../utils/add-row-index/add-row-index';
import { useSearchParams } from '../useSearchParams/useSearchParams';
import produce from 'immer';
import { ISearchParams } from '../../interfaces';

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
	const withRowIndex = useMemo(
		() => data?.map(addRowIndex),
		[data],
	);
	const [searchParams, setSearchParams] =
		useSearchParams<ISearchParams>();
	const { search, sort_by, sort_dir, cursor, limit } = searchParams;
	const camelCasedSortBy = camelCase(sort_by);
	const [globalFilter, setGlobalFilter] = useState(search ?? '');
	const isDesc = sort_dir === 'desc';
	const onGlobalFilter: ChangeEventHandler<HTMLInputElement> =
		useCallback(
			(e) => {
				setGlobalFilter(e.target.value);
			},
			[setGlobalFilter],
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
	const tableOptions: TableOptions<TData> = {
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
		onSortingChange: setSorting,
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
		...options,
		initialState: {
			pagination: {
				pageSize: limit ? Number(limit) : undefined,
				pageIndex: cursor ? Number(cursor) - 1 : undefined,
			},
		},
	};
	const table = useReactTable(
		// Merge passed options with default options, using produce reduces levels of nesting and keeps all spreads in one, easy to read place.
		produce(tableOptions, (draft) => {
			draft.state = {
				...draft.state,
				...options?.state,
			};
			draft.initialState = {
				...draft.initialState,
				...options?.initialState,
			};
			draft.initialState.pagination = {
				...draft.initialState.pagination,
				...options?.initialState?.pagination,
			};
			draft.meta = {
				...draft.meta,
			};
			draft.meta.updateData = options?.meta?.updateData?.(
				skipAutoResetPageIndex,
			);
		}),
	);
	const pageIndex = table.getState().pagination.pageIndex;
	const pageSize = table.getState().pagination.pageSize;

	// Sync state with search params
	useEffect(() => {
		setSearchParams({
			search: globalFilter,
			sort_by: snakeCase(sorting.at(0)?.id),
			sort_dir: sorting?.at(0)?.desc ? 'asc' : 'desc',
			cursor: Math.max(pageIndex + 1, 1),
			limit: Math.max(pageSize, 1),
		});
	}, [
		globalFilter,
		sorting?.at(0)?.id,
		sorting?.at(0)?.desc,
		pageIndex,
		pageSize,
	]);

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

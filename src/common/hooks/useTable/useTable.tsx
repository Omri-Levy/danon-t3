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
import { isInstanceOfFunction } from '../../utils/is-instance-of-function/is-instance-of-function';
import { useSearchParams } from 'react-router-dom';
import { parseSearchParams } from '../../../products/components/ProductsTable/hooks/useProductsTable./useProductsTable';
import produce from 'immer';

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
	const [searchParams, setSearchParams] = useSearchParams();
	const {
		search,
		filter,
		filter_by,
		sort_by,
		sort_dir,
		cursor,
		limit,
	} = parseSearchParams(searchParams);
	const camelCasedSortBy = camelCase(sort_by);
	const isDesc = sort_dir === 'desc';
	const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();
	const [globalFilter, setGlobalFilter] = useState(search ?? '');
	const onGlobalFilter: ChangeEventHandler<HTMLInputElement> =
		useCallback(
			(e) => {
				setGlobalFilter(e.target.value);
			},
			[setGlobalFilter],
		);
	const [sorting, setSorting] = useState<SortingState>([
		{
			id:
				camelCasedSortBy === ''
					? initialSorting?.[0]?.id ?? 'id'
					: camelCasedSortBy,
			desc:
				sort_dir === ''
					? initialSorting?.[0]?.desc ?? false
					: isDesc,
		},
	]);
	const updateSortSearchParams = useCallback(
		(old: SortingState) => {
			const currentSorting = old.at(0);

			searchParams.set(
				'sort_by',
				snakeCase(currentSorting?.id),
			);
			searchParams.set(
				'sort_dir',
				currentSorting?.desc ? 'asc' : 'desc',
			);

			setSearchParams(searchParams);
		},
		[setSorting],
	);
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
				...options?.meta,
			};
			draft.meta.updateData = options?.meta?.updateData?.(
				skipAutoResetPageIndex,
			);
		}),
	);
	const pageIndex = table.getState().pagination.pageIndex;
	const pageSize = table.getState().pagination.pageSize;

	// Protects against updating or deleting a row that is not visible
	useEffect(() => {
		setRowSelection({});
	}, [filter, filter_by, search]);

	useEffect(() => {
		setSearchParams({
			...parseSearchParams(searchParams),
			search: globalFilter,
			sort_by: snakeCase(sorting?.at(0)?.id),
			sort_dir: sorting?.at(0)?.desc ? 'asc' : 'desc',
			limit: Math.max(pageSize, 1).toString(),
			cursor: Math.max(pageIndex + 1, 1).toString(),
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

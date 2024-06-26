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
	useState,
} from 'react';
import { useSkipper } from '../useSkipper/useSkipper';
import { camelCase, snakeCase } from 'lodash';
import { IndeterminateCheckbox } from '../../components/atoms/IndeterminateCheckbox/IndeterminateCheckbox';
import { locale } from '../../translations';
import { isInstanceOfFunction } from '../../utils/is-instance-of-function/is-instance-of-function';
import { useSearchParams } from 'react-router-dom';
import { parseSearchParams } from '../../../products/components/ProductsTable/hooks/useProductsTable./useProductsTable';
import queryString from 'query-string';
import { parseQueryString } from '../../utils/parse-query-string/parse-query-string';
import { useDebounce } from 'react-use';

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
	const { search, sort_by, sort_dir, cursor, limit, selected } =
		parseSearchParams(searchParams);
	const camelCasedSortBy = camelCase(sort_by);
	const isDesc = sort_dir === 'desc';
	const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();
	const [globalFilter, setGlobalFilter] = useState(search ?? '');
	const onGlobalFilter: ChangeEventHandler<HTMLInputElement> =
		useCallback(
			async (e) => {
				setGlobalFilter(e.target.value);
				setRowSelection({});
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
		useState<RowSelectionState>(
			parseQueryString<RowSelectionState>(selected ?? '') ?? {},
		);
	const { state, initialState, meta, ...restOptions } = options;
	const { pagination, ...restInitialState } = initialState ?? {};
	const { updateData, ...restMeta } = meta ?? {};
	const table = useReactTable({
		columns: [
			{
				id: 'select',
				header: ({ table }) => (
					<div
						className={`bg-base-100 rounded-lg inline-flex`}
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
					<div className={`pl-2 flex p-1`}>
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
				id: 'index',
				header: locale.he.row,
			},
		],
		data,
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
		meta: {
			updateData: updateData?.(skipAutoResetPageIndex),
			...restMeta,
		},
		state: {
			rowSelection,
			sorting,
			globalFilter,
			...state,
		},
		initialState: {
			pagination: {
				...pagination,
				pageSize: limit
					? Number(limit)
					: pagination?.pageSize,
				pageIndex: cursor
					? Number(cursor) - 1
					: pagination?.pageIndex,
			},
			...restInitialState,
		},
		...restOptions,
	});
	const pageIndex = table.getState().pagination.pageIndex;
	const pageSize = table.getState().pagination.pageSize;
	const currentSorting = sorting?.at(0);
	const onSearchParamsChange = useCallback(() => {
		setSearchParams({
			...parseSearchParams(searchParams),
			search: globalFilter,
			sort_by: snakeCase(sorting?.at(0)?.id),
			sort_dir: sorting?.at(0)?.desc ? 'desc' : 'asc',
			limit: Math.max(pageSize, 1).toString(),
			cursor: Math.max(pageIndex + 1, 1).toString(),
			selected: queryString.stringify(rowSelection),
		});
	}, [
		globalFilter,
		currentSorting?.id,
		currentSorting?.desc,
		pageIndex,
		pageSize,
		rowSelection,
	]);
	const [, debouncedOnSearchParamsChange] = useDebounce(
		onSearchParamsChange,
		350,
		[onSearchParamsChange],
	);
	const [, debouncedOnSelectedChange] = useDebounce(
		() => {
			if (selected) return;

			setRowSelection({});
		},
		350,
		[selected],
	);

	useEffect(() => {
		debouncedOnSearchParamsChange();
	}, [debouncedOnSearchParamsChange]);

	// Initialization does not work with the debounced function
	useEffect(() => {
		onSearchParamsChange();
	}, []);

	useEffect(() => {
		debouncedOnSelectedChange();
	}, [debouncedOnSelectedChange]);

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

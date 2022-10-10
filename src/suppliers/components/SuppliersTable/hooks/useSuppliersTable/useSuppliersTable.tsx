import {
	TSupplierGetAllOutput,
	TSupplierGetByIdOutput,
} from '../../../../../common/types';
import { useCallback } from 'react';
import { ColumnDef, RowData, Table } from '@tanstack/table-core';
import { useUpdateSupplierById } from '../../../../suppliers.api';
import { locale } from '../../../../../common/translations';
import { DefaultCell } from '../../../../../common/components/atoms/DefaultCell/DefaultCell';
import { updateSupplierSchema } from '../../../../validation';
import { toast } from 'react-hot-toast';
import { useTable } from '../../../../../common/hooks/useTable/useTable';
import { useSearchParams } from 'react-router-dom';
import { fallbackWhen } from '../../../../../common/utils/fallback-when/fallback-when';

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

export const useSuppliersTable = (
	suppliers: TSupplierGetAllOutput,
) => {
	0;
	const { onUpdateById } = useUpdateSupplierById();
	const columns: Array<ColumnDef<TSupplierGetByIdOutput>> = [
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
	const updateData = useCallback(
		(skipAutoResetPageIndex: () => void) =>
			async (
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

					toast.error(
						`${locale.he.actions.error} ${error}`,
					);

					return;
				}

				await onUpdateById({
					[columnId]: value,
					id: prevSupplier?.id,
				});
			},
		[suppliers?.length, onUpdateById],
	);
	const [searchParams] = useSearchParams();
	const { limit = '', cursor = '' } = Object.fromEntries(
		searchParams.entries(),
	);
	const table = useTable({
		columns,
		data: suppliers,
		defaultColumn,
		initialState: {
			pagination: {
				// Lowest of 1, fallback to 50 if limit is falsy.
				pageSize: Math.max(
					fallbackWhen(Number(limit), 50, !limit),
					1,
				),
				// Lowest of 0, fallback to 1 if cursor is falsy.
				pageIndex: Math.max(
					fallbackWhen(Number(cursor) - 1, 0, !cursor),
					0,
				),
			},
		},
		initialSorting: [{ id: 'name', desc: false }],
		meta: {
			updateData,
		},
	});

	return table;
};

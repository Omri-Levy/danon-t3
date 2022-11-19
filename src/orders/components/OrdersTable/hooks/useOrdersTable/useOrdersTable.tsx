import {
	TOrderGetAllOutput,
	TOrderGetByIdOutput,
} from '../../../../../common/types';
import { ColumnDef } from '@tanstack/table-core';
import { locale } from '../../../../../common/translations';
import { ViewPDFButton } from './ViewPDFButton/ViewPDFButton';
import { isInstanceOfDate } from '../../../../common/utils/is-instance-of-date/is-instance-of-date';
import { useTable } from '../../../../../common/hooks/useTable/useTable';
import { fallbackWhen } from '../../../../../common/utils/fallback-when/fallback-when';
import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { parseSearchParams } from '../../../../../products/components/ProductsTable/hooks/useProductsTable./useProductsTable';
import { Order } from '../../../../../db/db';

export const useOrdersTable = (
	orders: TOrderGetAllOutput,
	onIdChange: (id: string) => void,
) => {
	const columns: Array<ColumnDef<TOrderGetByIdOutput>> = useMemo(
		() => [
			{
				header: locale.he.pdf,
				cell: (props) => (
					<ViewPDFButton
						orders={orders}
						onIdChange={onIdChange}
						{...props}
					/>
				),
			},
			{
				accessorKey: 'orderNumber',
				header: locale.he.orderNumber,
				cell: ({ getValue }) => {
					const value = getValue();

					if (typeof value !== 'number') {
						return value;
					}

					return value?.toString().padStart(5, '0');
				},
			},
			{
				accessorKey: 'createdAt',
				header: locale.he.createdAt,
				accessorFn: (row: Order) => {
					const value = row?.createdAt;

					if (!isInstanceOfDate(value)) {
						return value;
					}

					return new Date(value).toLocaleDateString();
				},
			},
			{
				accessorKey: 'supplier.name',
				header: locale.he.supplier,
			},
		],
		[onIdChange, orders?.length],
	);
	const [searchParams] = useSearchParams();
	const { limit = '', cursor = '' } =
		parseSearchParams(searchParams);
	const table = useTable({
		columns,
		data: orders,
		initialState: {
			pagination: {
				// Lowest of 1, fallback to 50 if limit is falsy.
				pageSize: Math.max(
					fallbackWhen(Number(limit), 50, !limit),
					1,
				),
				// Lowest of 0, fallback to 0 if cursor is falsy.
				pageIndex: Math.max(
					fallbackWhen(Number(cursor) - 1, 0, !cursor),
					0,
				),
			},
		},
		initialSorting: [{ id: 'createdAt', desc: false }],
	});

	return table;
};

import { TProductGetByIdOutput } from '../../../../../common/types';
import { useCallback, useMemo } from 'react';
import {
	ColumnDef,
	createColumnHelper,
	RowData,
	Table,
} from '@tanstack/table-core';
import { useGetAllSupplierNames } from '../../../../../suppliers/suppliers.api';
import { useUpdateProductById } from '../../../../products.api';
import { locale } from '../../../../../common/translations';
import { SelectColumn } from '../../../../../common/components/atoms/SelectColumn/SelectColumn';
import { Unit } from '../../../../../common/enums';
import { DefaultCell } from '../../../../../common/components/atoms/DefaultCell/DefaultCell';
import {
	productIdSchema,
	updateProductSchema,
} from '../../../../validation';
import { toast } from 'react-hot-toast';
import { zSupplierNamesEnum } from '../../../../../suppliers/utils/z-supplier-names-enum/z-supplier-names-enum';
import { useTable } from '../../../../../common/hooks/useTable/useTable';
import { fallbackWhen } from '../../../../../common/utils/fallback-when/fallback-when';
import { useSearchParams } from 'react-router-dom';

export const parseSearchParams = (searchParams: URLSearchParams) =>
	Object.fromEntries(searchParams.entries());

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
					isCurrency?: boolean;
			  }
			| {
					type: 'number';
					min: number;
					className: 'text-left';
					dir: 'rtl';
					isCurrency?: boolean;
			  }
			| {
					type: 'text';
					className?: string;
			  };
	}
}

export const columnHelper =
	createColumnHelper<TProductGetByIdOutput>();
export const useProductsTable = (
	products: Array<TProductGetByIdOutput>,
) => {
	const { supplierNames } = useGetAllSupplierNames();
	const { onUpdateById } = useUpdateProductById();
	const columns: Array<ColumnDef<TProductGetByIdOutput>> = useMemo(
		() => [
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
		],
		[supplierNames?.length],
	);
	const defaultColumn = {
		cell: DefaultCell,
	};
	// Checks supplier name as an enum instead of string.
	const runtimeSchema = updateProductSchema
		.setKey('supplier', zSupplierNamesEnum(supplierNames ?? []))
		.partial()
		.setKey('id', productIdSchema.shape.id);
	const updateData = useCallback(
		(skipAutoResetPageIndex: () => void) =>
			async (
				rowIndex: number,
				columnId: string,
				value: any,
			) => {
				// Skip page index reset until after next rerender
				skipAutoResetPageIndex();

				const prevProduct = products?.[rowIndex];

				if (!prevProduct) return;

				const column =
					columnId === 'supplier_name'
						? 'supplier'
						: columnId;
				const isNumeric = ['orderAmount', 'packageSize'].some(
					(col) => col === columnId,
				);
				const result = runtimeSchema.safeParse({
					id: prevProduct.id,
					[column]: isNumeric ? parseFloat(value) : value,
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

				const prevOrderAmount = prevProduct.orderAmount;
				const prevPackageSize = prevProduct.packageSize;
				const isOrderAmount = column === 'orderAmount';
				const isPackageSize = column === 'packageSize';
				const orderAmount = parseFloat(
					isOrderAmount ? value : prevOrderAmount,
				);
				const packageSize = parseFloat(
					isPackageSize ? value : prevPackageSize,
				);
				const isException =
					orderAmount === 0 || packageSize === 1;
				const isDivisible =
					Math.round(orderAmount % packageSize) === 0;
				const shouldUpdate = isException || isDivisible;

				if (
					(isOrderAmount || isPackageSize) &&
					!shouldUpdate
				) {
					toast.error(locale.he.mustBeDivisibleBy);

					return;
				}

				await onUpdateById({
					...result.data,
					id: prevProduct.id,
				});
			},
		[onUpdateById, products?.length],
	);
	const format = useCallback(
		(
			rowIndex: number,
			columnId: string,
			table: Table<TProductGetByIdOutput>,
		) =>
			['orderAmount', 'packageSize'].some(
				(value) => value === columnId,
			)
				? {
						type: 'number',
						className: 'text-left',
						step:
							columnId === 'orderAmount'
								? table.getRow(rowIndex.toString())
										.original?.packageSize
								: undefined,
						min: 0,
						dir: 'rtl',
						isEditable: true,
				  }
				: {
						type: 'text',
						isEditable: true,
				  },
		[],
	);
	const [searchParams] = useSearchParams();
	const { limit = '', cursor = '' } =
		parseSearchParams(searchParams);
	const table = useTable({
		columns,
		data: products,
		defaultColumn,
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
		initialSorting: [{ id: 'name', desc: false }],
		meta: {
			updateData,
			format,
		},
	});

	return table;
};

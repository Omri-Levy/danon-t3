import { useLoaderData, useSearchParams } from 'react-router-dom';
import {
	parseSearchParams,
	useStockTable,
} from '../../components/StockTable/hooks/useStockTable/useStockTable';
import { stockLoader } from '../../stock.loader';
import { useGetAllSupplierNames } from '../../../suppliers/suppliers.api';
import { useGetAllProductsBySupplierName } from '../../stock.api';

export const useStock = () => {
	// For router loader initial data
	const { products: initialProducts, suppliers: initialSuppliers } =
		useLoaderData() as Awaited<
			ReturnType<ReturnType<typeof stockLoader>>
		>;
	const [searchParams] = useSearchParams();
	const { filter: supplier = '' } = parseSearchParams(searchParams);

	// Queries
	useGetAllSupplierNames(initialSuppliers);

	const { products, isLoading } = useGetAllProductsBySupplierName(
		supplier,
		initialProducts,
	);

	const {
		table,
		globalFilter,
		onGlobalFilter,
		rowSelection,
		setRowSelection,
	} = useStockTable(products ?? []);

	return {
		rowSelection,
		setRowSelection,
		isLoading,
		products,
		table,
		globalFilter,
		onGlobalFilter,
	};
};

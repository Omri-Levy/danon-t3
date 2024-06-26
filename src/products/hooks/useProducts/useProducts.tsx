import { useLoaderData, useSearchParams } from 'react-router-dom';
import {
	parseSearchParams,
	useProductsTable,
} from '../../components/ProductsTable/hooks/useProductsTable./useProductsTable';
import { productsLoader } from '../../products.loader';
import { useGetAllSupplierNames } from '../../../suppliers/suppliers.api';
import { useGetAllProductsBySupplierName } from '../../products.api';

export const useProducts = () => {
	// For router loader initial data
	const { products: initialProducts, suppliers: initialSuppliers } =
		useLoaderData() as Awaited<
			ReturnType<ReturnType<typeof productsLoader>>
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
	} = useProductsTable(products ?? []);

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

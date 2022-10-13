import { useLoaderData } from 'react-router-dom';
import { useProductsTable } from '../../components/ProductsTable/hooks/useProductsTable./useProductsTable';
import { productsLoader } from '../../products.loader';
import { useGetAllSupplierNames } from '../../../suppliers/suppliers.api';
import { useGetAllProductsBySupplierName } from '../../products.api';
import { useSearchParams } from '../../../common/hooks/useSearchParams/useSearchParams';

export const useProducts = () => {
	// For router loader initial data
	const { products: initialProducts, suppliers: initialSuppliers } =
		useLoaderData() as Awaited<
			ReturnType<ReturnType<typeof productsLoader>>
		>;
	const [{ filter: supplier = '' }] = useSearchParams();

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
	} = useProductsTable(products);

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

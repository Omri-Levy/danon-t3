import { useLoaderData } from 'react-router-dom';
import { useProductsTable } from '../../components/ProductsTable/hooks/useProductsTable./useProductsTable';
import { productsLoader } from '../../products.loader';
import { useGetAllSupplierNames } from '../../../suppliers/suppliers.api';
import { useGetAllProducts } from '../../products.api';

export const useProducts = () => {
	// For router loader initial data
	const { products: initialProducts, suppliers: initialSuppliers } =
		useLoaderData() as Awaited<
			ReturnType<ReturnType<typeof productsLoader>>
		>;

	// Queries
	const { products, isLoading } =
		useGetAllProducts(initialProducts);

	useGetAllSupplierNames(initialSuppliers);

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

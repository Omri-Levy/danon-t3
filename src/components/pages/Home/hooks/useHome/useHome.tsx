import { useLoaderData } from 'react-router-dom';
import { loader } from '../../loader';
import { useGetAllSupplierNames } from '../../../../../api/suppliers-api';
import { useGetAllProducts } from '../../../../../api/products-api';
import { useProductsTable } from '../../ProductsTable/hooks/useProductsTable./useProductsTable';

export const useHome = () => {
	// For router loader initial data
	const { products: initialProducts, suppliers: initialSuppliers } =
		useLoaderData() as Awaited<
			ReturnType<ReturnType<typeof loader>>
		>;

	// Queries
	const { products, isLoading } = useGetAllProducts({
		initialData: initialProducts,
	});

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

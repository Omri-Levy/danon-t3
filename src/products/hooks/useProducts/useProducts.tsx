import { useLoaderData, useSearchParams } from 'react-router-dom';
import { useProductsTable } from '../../components/ProductsTable/hooks/useProductsTable./useProductsTable';
import { productsLoader } from '../../products.loader';
import { useGetAllSupplierNames } from '../../../suppliers/suppliers.api';
import { useGetAllProductsBySupplierName } from '../../products.api';
import { ChangeEventHandler, useCallback, useState } from 'react';

export const useProducts = () => {
	// For router loader initial data
	const { products: initialProducts, suppliers: initialSuppliers } =
		useLoaderData() as Awaited<
			ReturnType<ReturnType<typeof productsLoader>>
		>;
	const { supplierNames } =
		useGetAllSupplierNames(initialSuppliers);
	const [searchParams, setSearchParams] = useSearchParams();
	const prevSearchParams = Object.fromEntries(
		searchParams.entries(),
	);
	const [supplier, setSupplier] = useState(
		prevSearchParams?.filter ?? '',
	);
	const onUpdateSupplier: ChangeEventHandler<HTMLSelectElement> =
		useCallback(
			(e) => {
				if (!e.target.value) return;

				setSupplier(e.target.value);
				setSearchParams(() => ({
					...prevSearchParams,
					filter_by: 'supplier',
					filter: e.target.value,
				}));
			},
			[setSupplier, setSearchParams],
		);

	// Queries
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
		supplierNames,
		supplier,
		onUpdateSupplier,
	};
};

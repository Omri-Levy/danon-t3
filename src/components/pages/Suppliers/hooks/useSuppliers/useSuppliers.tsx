import { useLoaderData } from 'react-router-dom';
import { loader } from '../../loader';
import { useGetAllSuppliers } from '../../../../../api/suppliers-api';
import { useSuppliersTable } from '../../SuppliersTable/hooks/useSuppliersTable/useSuppliersTable';

export const useSuppliers = () => {
	const initialSuppliers = useLoaderData() as Awaited<
		ReturnType<ReturnType<typeof loader>>
	>;
	const { suppliers, isLoading } =
		useGetAllSuppliers(initialSuppliers);
	const suppliersCount = suppliers?.length ?? 0;
	const {
		table,
		rowSelection,
		setRowSelection,
		globalFilter,
		onGlobalFilter,
	} = useSuppliersTable(suppliers);

	return {
		isLoading,
		suppliers,
		suppliersCount,
		table,
		globalFilter,
		onGlobalFilter,
		rowSelection,
		setRowSelection,
	};
};

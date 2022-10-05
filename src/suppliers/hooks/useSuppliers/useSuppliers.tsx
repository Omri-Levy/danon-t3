import { useLoaderData } from 'react-router-dom';
import { useSuppliersTable } from '../../components/SuppliersTable/hooks/useSuppliersTable/useSuppliersTable';
import { suppliersLoader } from '../../suppliers.loader';
import { useGetAllSuppliers } from '../../suppliers.api';

export const useSuppliers = () => {
	const initialSuppliers = useLoaderData() as Awaited<
		ReturnType<ReturnType<typeof suppliersLoader>>
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

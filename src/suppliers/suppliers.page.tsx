import { NextPage } from 'next';
import { locale } from '../common/translations';
import { Pagination } from '../common/components/organisms/Pagination/Pagination';
import { SuppliersTable } from './components/SuppliersTable/SuppliersTable';
import { useSuppliers } from './hooks/useSuppliers/useSuppliers';
import { TopBar } from '../common/components/molecules/TopBar/TopBar';
import { SuppliersActions } from './components/SuppliersActions/SuppliersActions';

export const Suppliers: NextPage = () => {
	const {
		isLoading,
		table,
		suppliersCount,
		suppliers,
		globalFilter,
		onGlobalFilter,
		rowSelection,
		setRowSelection,
	} = useSuppliers();

	return (
		<>
			<TopBar
				resource={locale.he.suppliers}
				Actions={
					<SuppliersActions
						rowSelection={rowSelection}
						setRowSelection={setRowSelection}
					/>
				}
				globalFilter={globalFilter}
				onGlobalFilter={onGlobalFilter}
				resourceCount={suppliersCount}
			/>
			<div
				className={`overflow-auto h-[78vh] flex flex-col justify-between`}
			>
				{!isLoading && <SuppliersTable table={table} />}
				{!!suppliers?.length && <Pagination table={table} />}
			</div>
		</>
	);
};

import { NextPage } from 'next';
import { locale } from '../../../translations';
import { Pagination } from '../../organisms/Pagination/Pagination';
import { SuppliersTable } from './SuppliersTable/SuppliersTable';
import { useSuppliers } from './hooks/useSuppliers/useSuppliers';
import { TopBar } from '../../molecules/TopBar/TopBar';
import { SuppliersActions } from './SuppliersActions/SuppliersActions';

const Suppliers: NextPage = () => {
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
			<div className={`overflow-auto h-[78vh]`}>
				{!isLoading && <SuppliersTable table={table} />}
			</div>
			{!!suppliers?.length && <Pagination table={table} />}
		</>
	);
};

export default Suppliers;

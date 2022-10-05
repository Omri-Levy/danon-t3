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
		<section className={'w-fit xl:w-full xl:max-w-[1536px]'}>
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
		</section>
	);
};

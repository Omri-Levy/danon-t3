import type { NextPage } from 'next';
import { locale } from '../../../translations';
import { Pagination } from '../../organisms/Pagination/Pagination';
import { TopBar } from '../../molecules/TopBar/TopBar';
import { ProductsTable } from './ProductsTable/ProductsTable';
import { useHome } from './hooks/useHome/useHome';
import { NoSuppliersDialog } from './NoSuppliersDialog/NoSuppliersDialog';
import { HomeActions } from './HomeActions/HomeActions';

const Home: NextPage = () => {
	const {
		isLoading,
		products,
		table,
		globalFilter,
		onGlobalFilter,
		rowSelection,
		setRowSelection,
	} = useHome();

	return (
		<>
			<NoSuppliersDialog />
			<TopBar
				resource={locale.he.products}
				Actions={
					<HomeActions
						rowSelection={rowSelection}
						setRowSelection={setRowSelection}
					/>
				}
				globalFilter={globalFilter}
				onGlobalFilter={onGlobalFilter}
				resourceCount={
					table.getPreFilteredRowModel()?.rows.length
				}
			/>
			<div className={`overflow-auto h-[78vh]`}>
				{!isLoading && <ProductsTable table={table} />}
			</div>
			{!!products?.length && <Pagination table={table} />}
		</>
	);
};

export default Home;

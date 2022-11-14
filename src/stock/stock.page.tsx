import type { NextPage } from 'next';
import { StockActions } from './components/StockActions/StockActions';
import { StockTable } from './components/StockTable/StockTable';
import { NoSuppliersDialog } from './components/NoSuppliersDialog/NoSuppliersDialog';
import { TopBar } from '../common/components/molecules/TopBar/TopBar';
import { locale } from '../common/translations';
import { Pagination } from '../common/components/organisms/Pagination/Pagination';
import { useProducts } from './hooks/useProducts/useProducts';
import { SelectSupplier } from '../common/components/atoms/SelectSupplier/SelectSupplier';

export const Stock: NextPage = () => {
	const {
		isLoading,
		products,
		table,
		globalFilter,
		onGlobalFilter,
		rowSelection,
	} = useProducts();

	return (
		<>
			<NoSuppliersDialog />
			<TopBar
				resource={locale.he.products}
				Actions={<StockActions rowSelection={rowSelection} />}
				TopBarEnd={<SelectSupplier />}
				globalFilter={globalFilter}
				onGlobalFilter={onGlobalFilter}
				resourceCount={
					table.getPreFilteredRowModel()?.rows?.length
				}
			/>
			<div className={`overflow-auto h-[70vh]`}>
				{!isLoading && <StockTable table={table} />}
			</div>
			{!!products?.length && <Pagination table={table} />}
		</>
	);
};

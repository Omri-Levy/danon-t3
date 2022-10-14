import type { NextPage } from 'next';
import { ProductsActions } from './components/ProductsActions/ProductsActions';
import { ProductsTable } from './components/ProductsTable/ProductsTable';
import { NoSuppliersDialog } from './components/NoSuppliersDialog/NoSuppliersDialog';
import { TopBar } from '../common/components/molecules/TopBar/TopBar';
import { locale } from '../common/translations';
import { Pagination } from '../common/components/organisms/Pagination/Pagination';
import { useProducts } from './hooks/useProducts/useProducts';
import { SelectSupplier } from '../common/components/atoms/SelectSupplier/SelectSupplier';

export const Products: NextPage = () => {
	const {
		isLoading,
		products,
		table,
		globalFilter,
		onGlobalFilter,
		rowSelection,
		setRowSelection,
	} = useProducts();

	return (
		<>
			<NoSuppliersDialog />
			<TopBar
				resource={locale.he.products}
				Actions={
					<ProductsActions
						rowSelection={rowSelection}
						setRowSelection={setRowSelection}
					/>
				}
				TopBarEnd={<SelectSupplier />}
				globalFilter={globalFilter}
				onGlobalFilter={onGlobalFilter}
				resourceCount={
					table.getPreFilteredRowModel()?.rows?.length
				}
			/>
			<div
				className={`overflow-auto flex flex-col justify-between h-[78vh]`}
			>
				{!isLoading && <ProductsTable table={table} />}
				{!!products?.length && <Pagination table={table} />}
			</div>
		</>
	);
};

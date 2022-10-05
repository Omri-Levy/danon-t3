import type { NextPage } from 'next';
import { ProductsActions } from './components/ProductsActions/ProductsActions';
import { ProductsTable } from './components/ProductsTable/ProductsTable';
import { NoSuppliersDialog } from './components/NoSuppliersDialog/NoSuppliersDialog';
import { TopBar } from '../common/components/molecules/TopBar/TopBar';
import { locale } from '../common/translations';
import { Pagination } from '../common/components/organisms/Pagination/Pagination';
import { useProducts } from './hooks/useProducts/useProducts';

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
		<section className={'w-fit 2xl:w-full 2xl:max-w-[1536px]'}>
			<NoSuppliersDialog />
			<TopBar
				resource={locale.he.products}
				Actions={
					<ProductsActions
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
		</section>
	);
};

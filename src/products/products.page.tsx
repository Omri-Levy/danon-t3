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
		supplierNames,
		supplier,
		onUpdateSupplier,
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
				TopBarEnd={
					<div>
						<label className={`label block text-right`}>
							<span className={`label-text`}>
								{locale.he.supplier}
							</span>
						</label>
						<select
							className='select select-bordered'
							value={supplier ?? supplierNames?.[0]}
							onChange={onUpdateSupplier}
						>
							{supplierNames?.map((o) => (
								<option
									key={`${o}-select-option`}
									disabled={supplier === o}
								>
									{o}
								</option>
							))}
						</select>
					</div>
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

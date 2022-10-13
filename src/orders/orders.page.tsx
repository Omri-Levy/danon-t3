import { NextPage } from 'next';
import { locale } from '../common/translations';
import { Pagination } from '../common/components/organisms/Pagination/Pagination';
import { OrdersTable } from './components/OrdersTable/OrdersTable';
import { ViewPDF } from './components/ViewPDF/ViewPDF';
import { useOrders } from './hooks/useOrders/useOrders';
import { TopBar } from '../common/components/molecules/TopBar/TopBar';
import { OrdersActions } from './components/OrdersActions/OrdersActions';
import { SelectSupplier } from '../common/components/atoms/SelectSupplier/SelectSupplier';

export const Orders: NextPage = () => {
	const {
		table,
		globalFilter,
		onGlobalFilter,
		isLoading,
		orders,
		ordersCount,
		isOpen,
		toggleIsOpen,
		presignedUrl,
		rowSelection,
		setRowSelection,
	} = useOrders();

	return (
		<section className={'w-fit xl:w-full xl:max-w-[1536px]'}>
			<ViewPDF
				presignedUrl={presignedUrl ?? ''}
				isOpen={isOpen}
				onOpen={toggleIsOpen}
			/>
			<TopBar
				resource={locale.he.orders}
				TopBarEnd={<SelectSupplier />}
				Actions={
					<OrdersActions
						rowSelection={rowSelection}
						setRowSelection={setRowSelection}
					/>
				}
				globalFilter={globalFilter}
				onGlobalFilter={onGlobalFilter}
				resourceCount={ordersCount}
			/>
			<div className={`overflow-auto h-[78vh]`}>
				{!isLoading && <OrdersTable table={table} />}
			</div>
			{!!orders?.length && <Pagination table={table} />}
		</section>
	);
};

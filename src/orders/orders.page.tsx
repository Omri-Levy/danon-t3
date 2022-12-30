import { NextPage } from 'next';
import { locale } from '../common/translations';
import { Pagination } from '../common/components/organisms/Pagination/Pagination';
import { OrdersTable } from './components/OrdersTable/OrdersTable';
import { useOrders } from './hooks/useOrders/useOrders';
import { TopBar } from '../common/components/molecules/TopBar/TopBar';
import { OrdersActions } from './components/OrdersActions/OrdersActions';
import { SelectSupplier } from '../common/components/atoms/SelectSupplier/SelectSupplier';

export const Orders: NextPage = () => {
	const {
		isLoading,
		table,
		globalFilter,
		onGlobalFilter,
		orders,
		ordersCount,
		rowSelection,
	} = useOrders();

	return (
		<>
			<TopBar
				resource={locale.he.orders}
				TopBarEnd={<SelectSupplier />}
				Actions={
					<OrdersActions rowSelection={rowSelection} />
				}
				globalFilter={globalFilter}
				onGlobalFilter={onGlobalFilter}
				resourceCount={ordersCount}
			/>
			<div className={`overflow-auto h-[calc(100vh-11.5rem)]`}>
				{!isLoading && <OrdersTable table={table} />}
			</div>
			{!!orders?.length && <Pagination table={table} />}
		</>
	);
};

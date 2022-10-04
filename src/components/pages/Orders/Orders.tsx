import { NextPage } from 'next';
import clsx from 'clsx';
import { locale } from '../../../translations';
import { Pagination } from '../../organisms/Pagination/Pagination';
import { OrdersTable } from './OrdersTable/OrdersTable';
import { ViewPDF } from '../../molecules/ViewPDF/ViewPDF';
import { useOrders } from './hooks/useOrders/useOrders';
import { TopBar } from '../../molecules/TopBar/TopBar';
import {
	useDeleteOrdersByIds,
	useGetAllOrders,
} from '../../../api/orders-api';

const OrdersActions = ({ rowSelection, setRowSelection }) => {
	const { orders } = useGetAllOrders();
	const selectedOrders = orders
		?.filter((_, index) => rowSelection[index])
		.map(({ id }) => id);
	const { onDeleteByIds, isLoading: isLoadingDeleteByIds } =
		useDeleteOrdersByIds(setRowSelection);
	const disableDelete =
		!orders?.length || !Object.keys(rowSelection)?.length;
	const onDeleteSelectedOrders = async () => {
		if (!selectedOrders?.length) return;

		await onDeleteByIds({
			ids: selectedOrders,
		});
	};

	return (
		<div
			className={disableDelete ? `tooltip` : `inline`}
			data-tip={`לא ניתן לבצע מחיקת מוצרים עם 0 מוצרים מסומנים`}
		>
			<button
				disabled={disableDelete}
				className={clsx([
					`btn`,
					{ loading: isLoadingDeleteByIds },
				])}
				onClick={onDeleteSelectedOrders}
			>
				{locale.he.delete}
			</button>
		</div>
	);
};

const Orders: NextPage = () => {
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
		<>
			<ViewPDF
				presignedUrl={presignedUrl}
				isOpen={isOpen}
				onOpen={toggleIsOpen}
			/>
			<TopBar
				resource={locale.he.orders}
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
		</>
	);
};

export default Orders;

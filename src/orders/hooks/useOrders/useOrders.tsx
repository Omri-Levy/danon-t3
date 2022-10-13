import {
	useLoaderData,
	useNavigate,
	useParams,
} from 'react-router-dom';
import { useCallback, useEffect } from 'react';
import { useOrdersTable } from '../../components/OrdersTable/hooks/useOrdersTable/useOrdersTable';
import { ordersLoader } from '../../orders.loader';
import { useGetAllOrdersBySupplierName } from '../../orders.api';
import { useModalsStore } from '../../../common/stores/modals/modals';
import { useSearchParams } from '../../../common/hooks/useSearchParams/useSearchParams';

export const useOrders = () => {
	const { isOpen, onToggleIsViewingPDF } = useModalsStore();
	const { orderId } = useParams();
	const initialOrders = useLoaderData() as Awaited<
		ReturnType<ReturnType<typeof ordersLoader>>
	>;
	const [{ filter: supplier = '' }, , search] = useSearchParams();
	const { orders, isLoading } = useGetAllOrdersBySupplierName(
		supplier,
		initialOrders,
	);
	const navigate = useNavigate();
	const onIdChange = useCallback(
		(id: string) => {
			navigate({
				pathname: `/orders/${id}`,
				search,
			});
		},
		[navigate, search],
	);
	const {
		table,
		globalFilter,
		onGlobalFilter,
		rowSelection,
		setRowSelection,
	} = useOrdersTable(orders, onIdChange);
	const ordersCount = orders?.length ?? 0;

	// Reopen the modal on page reload
	useEffect(() => {
		if (!orderId || isOpen) return;

		onToggleIsViewingPDF(true);
	}, [orderId, isOpen]);

	return {
		isLoading,
		orders,
		ordersCount,
		table,
		globalFilter,
		onGlobalFilter,
		rowSelection,
		setRowSelection,
	};
};

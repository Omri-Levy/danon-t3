import {
	useLoaderData,
	useLocation,
	useNavigate,
	useParams,
	useSearchParams,
} from 'react-router-dom';
import { useCallback, useEffect } from 'react';
import { useOrdersTable } from '../../components/OrdersTable/hooks/useOrdersTable/useOrdersTable';
import { ordersLoader } from '../../orders.loader';
import { useGetAllOrdersBySupplierName } from '../../orders.api';
import {
	EModalType,
	useModalsStore,
} from '../../../common/stores/modals/modals';
import { parseSearchParams } from '../../../products/components/ProductsTable/hooks/useProductsTable./useProductsTable';

export const useOrders = () => {
	const { isOpen, onToggleIsViewingPDF, type } = useModalsStore(
		(state) => ({
			isOpen: state.isOpen,
			onToggleIsViewingPDF: state.onToggleIsViewingPDF,
			type: state.type,
		}),
	);
	const { orderId } = useParams();
	const { orders: initialOrders } = useLoaderData() as Awaited<
		ReturnType<ReturnType<typeof ordersLoader>>
	>;
	const [searchParams] = useSearchParams();
	const { filter: supplier = '' } = parseSearchParams(searchParams);
	const location = useLocation();
	const { orders, isLoading } = useGetAllOrdersBySupplierName(
		supplier,
		initialOrders,
	);
	const navigate = useNavigate();
	const onIdChange = useCallback(
		(id: string) => {
			navigate(`/orders-history/${id}${location.search}`);
		},
		[navigate, isOpen, location.search],
	);
	const {
		table,
		globalFilter,
		onGlobalFilter,
		rowSelection,
		setRowSelection,
	} = useOrdersTable(orders ?? [], onIdChange);
	const ordersCount = orders?.length ?? 0;

	// Reopen the modal on page reload
	useEffect(() => {
		if (!orderId || isOpen || type !== EModalType.VIEW_PDF)
			return;

		onToggleIsViewingPDF(true);
	}, [orderId, isOpen, type]);

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

import { useLoaderData } from 'react-router-dom';
import { useToggle } from 'react-use';
import { useCallback, useState } from 'react';
import { useOrdersTable } from '../../components/OrdersTable/hooks/useOrdersTable/useOrdersTable';
import { ordersLoader } from '../../orders.loader';
import {
	useGetAllOrders,
	useGetOrderPresignedUrlById,
} from '../../orders.api';

export const useOrders = () => {
	const initialOrders = useLoaderData() as Awaited<
		ReturnType<ReturnType<typeof ordersLoader>>
	>;
	const [isOpen, toggleIsOpen] = useToggle(false);
	const { orders, isLoading } = useGetAllOrders(initialOrders);
	const [id, setId] = useState('');
	const onIdChange = useCallback(
		(id: string) => setId(id),
		[setId],
	);
	const { data: presignedUrl } = useGetOrderPresignedUrlById({
		id,
		enabled: !!id && isOpen,
	});
	const {
		table,
		globalFilter,
		onGlobalFilter,
		rowSelection,
		setRowSelection,
	} = useOrdersTable(orders, onIdChange, toggleIsOpen);
	const ordersCount = orders?.length ?? 0;

	return {
		isLoading,
		orders,
		ordersCount,
		table,
		globalFilter,
		onGlobalFilter,
		rowSelection,
		setRowSelection,
		isOpen,
		toggleIsOpen,
		presignedUrl,
	};
};

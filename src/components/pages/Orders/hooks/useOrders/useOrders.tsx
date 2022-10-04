import { useLoaderData } from 'react-router-dom';
import { loader } from '../../loader';
import { useToggle } from 'react-use';
import {
	useGetAllOrders,
	useGetOrderPresignedUrlById,
} from '../../../../../api/orders-api';
import { useState } from 'react';
import { useOrdersTable } from '../../OrdersTable/hooks/useOrdersTable/useOrdersTable';

export const useOrders = () => {
	const initialOrders = useLoaderData() as Awaited<
		ReturnType<ReturnType<typeof loader>>
	>;
	const [isOpen, toggleIsOpen] = useToggle(false);
	const { orders, isLoading } = useGetAllOrders(initialOrders);
	const [id, setId] = useState('');
	const onIdChange = (id: string) => setId(id);
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

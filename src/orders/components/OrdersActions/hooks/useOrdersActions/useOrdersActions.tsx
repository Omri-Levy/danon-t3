import { Dispatch, SetStateAction } from 'react';
import {
	useDeleteOrdersByIds,
	useGetAllOrders,
} from '../../../../orders.api';

export const useOrdersActions = (
	rowSelection: Record<PropertyKey, boolean>,
	setRowSelection: Dispatch<
		SetStateAction<Record<PropertyKey, boolean>>
	>,
) => {
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

	return {
		disableDelete,
		isLoadingDeleteByIds,
		onDeleteSelectedOrders,
	};
};
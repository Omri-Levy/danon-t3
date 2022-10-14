import { Dispatch, SetStateAction } from 'react';
import {
	useDeleteOrdersByIds,
	useGetAllOrdersBySupplierName,
} from '../../../../orders.api';
import { useSearchParams } from 'react-router-dom';
import { parseSearchParams } from '../../../../../products/components/ProductsTable/hooks/useProductsTable./useProductsTable';

export const useOrdersActions = (
	rowSelection: Record<PropertyKey, boolean>,
	setRowSelection: Dispatch<
		SetStateAction<Record<PropertyKey, boolean>>
	>,
) => {
	const [searchParams] = useSearchParams();
	const { filter: supplier = '' } = parseSearchParams(searchParams);
	const { orders } = useGetAllOrdersBySupplierName(supplier);
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

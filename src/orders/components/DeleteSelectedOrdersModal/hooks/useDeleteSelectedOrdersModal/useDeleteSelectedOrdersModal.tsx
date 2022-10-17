import { useModalsStore } from '../../../../../common/stores/modals/modals';
import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { parseQueryString } from '../../../../../common/utils/parse-query-string/parse-query-string';
import { parseSearchParams } from '../../../../../products/components/ProductsTable/hooks/useProductsTable./useProductsTable';
import {
	useDeleteOrdersByIds,
	useGetAllOrdersBySupplierName,
} from '../../../../orders.api';

export const useDeleteSelectedOrdersModal = () => {
	const { isOpen, onToggleIsDeletingSelectedOrders } =
		useModalsStore((state) => ({
			isOpen: state.isOpen,
			onToggleIsDeletingSelectedOrders:
				state.onToggleIsDeletingSelectedOrders,
		}));
	const [searchParams] = useSearchParams();
	const { filter: supplier = '' } = parseSearchParams(searchParams);

	// Queries
	const { orders } = useGetAllOrdersBySupplierName(supplier);
	const { onDeleteByIds, isLoading } = useDeleteOrdersByIds(
		onToggleIsDeletingSelectedOrders,
	);
	const { selected } = parseSearchParams(searchParams);
	const rowSelection = parseQueryString(selected ?? '') ?? {};
	const selectedOrders = orders?.filter(
		(_, index) => rowSelection[index],
	);
	const selectedOrdersIds = selectedOrders?.map(({ id }) => id);
	const onDeleteSelectedOrders = useCallback(async () => {
		if (!selectedOrdersIds?.length) return;

		await onDeleteByIds({
			ids: selectedOrdersIds,
		});
	}, [onDeleteByIds, selectedOrdersIds?.length]);

	return {
		isOpen,
		onToggleIsDeletingSelectedOrders,
		onDeleteByIds,
		isLoading,
		onDeleteSelectedOrders,
	};
};

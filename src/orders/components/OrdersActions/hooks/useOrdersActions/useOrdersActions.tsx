import {
	useDeleteOrdersByIds,
	useGetAllOrdersBySupplierName,
} from '../../../../orders.api';
import { useSearchParams } from 'react-router-dom';
import { parseSearchParams } from '../../../../../products/components/ProductsTable/hooks/useProductsTable./useProductsTable';
import { useModalsStore } from '../../../../../common/stores/modals/modals';

export const useOrdersActions = (
	rowSelection: Record<PropertyKey, boolean>,
) => {
	const [searchParams] = useSearchParams();
	const { filter: supplier = '' } = parseSearchParams(searchParams);
	const { orders } = useGetAllOrdersBySupplierName(supplier);
	const selectedOrders = orders
		?.filter((_, index) => rowSelection[index])
		.map(({ id }) => id);
	const { isLoading: isLoadingDeleteByIds } =
		useDeleteOrdersByIds();
	const disableDelete = !orders?.length || !selectedOrders?.length;
	const { isOpen, onToggleIsDeletingSelectedOrders } =
		useModalsStore((state) => ({
			isOpen: state.isOpen,
			onToggleIsDeletingSelectedOrders:
				state.onToggleIsDeletingSelectedOrders,
		}));

	return {
		disableDelete,
		isLoadingDeleteByIds,
		isOpen,
		onToggleIsDeletingSelectedOrders,
	};
};

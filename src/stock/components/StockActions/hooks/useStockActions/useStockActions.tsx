import { useGetAllProductsBySupplierName } from '../../../../stock.api';
import { useModalsStore } from '../../../../../common/stores/modals/modals';
import { useSearchParams } from 'react-router-dom';
import { parseSearchParams } from '../../../StockTable/hooks/useStockTable/useStockTable';

export const useStockActions = (
	rowSelection: Record<PropertyKey, boolean>,
) => {
	// Modal toggles
	const {
		onToggleIsCreatingProduct,
		onToggleIsSendingOrder,
		onToggleIsPrintingStock,
		onToggleIsDeletingSelectedProducts,
		isOpen,
	} = useModalsStore((state) => ({
		isOpen: state.isOpen,
		onToggleIsCreatingProduct: state.onToggleIsCreatingProduct,
		onToggleIsSendingOrder: state.onToggleIsSendingOrder,
		onToggleIsPrintingStock: state.onToggleIsPrintingStock,
		onToggleIsDeletingSelectedProducts:
			state.onToggleIsDeletingSelectedProducts,
	}));

	const [searchParams] = useSearchParams();
	const { filter: supplier = '' } = parseSearchParams(searchParams);
	// Queries
	const { products } = useGetAllProductsBySupplierName(supplier);

	// Mutations
	const selectedProducts = products?.filter(
		(_, index) => rowSelection[index],
	);
	const selectedProductsIds = selectedProducts?.map(({ id }) => id);

	// Disables
	const disableDelete =
		!products?.length || !Object.keys(rowSelection)?.length;
	const disableResetOrderAmount = [
		!Object.keys(rowSelection)?.length,
		!selectedProducts?.filter(
			({ orderAmount }) => parseFloat(orderAmount) > 0,
		)?.length,
	].some(Boolean);

	return {
		onToggleIsSendingOrder,
		selectedProductsIds,
		disableResetOrderAmount,
		disableDelete,
		onToggleIsPrintingStock,
		onToggleIsCreatingProduct,
		onToggleIsDeletingSelectedProducts,
		isOpen,
	};
};

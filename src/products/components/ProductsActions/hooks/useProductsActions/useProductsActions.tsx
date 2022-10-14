import {
	useDeleteProductsByIds,
	useGetAllProductsBySupplierName,
	useIsValidToOrder,
	useResetProductsOrderAmountByIds,
} from '../../../../products.api';
import { Dispatch, SetStateAction, useCallback } from 'react';
import { useModalsStore } from '../../../../../common/stores/modals/modals';
import { useSearchParams } from 'react-router-dom';
import { parseSearchParams } from '../../../ProductsTable/hooks/useProductsTable./useProductsTable';

export const useProductsActions = (
	rowSelection: Record<PropertyKey, boolean>,
	setRowSelection: Dispatch<
		SetStateAction<Record<PropertyKey, boolean>>
	>,
) => {
	// Modal toggles
	const {
		onToggleIsCreatingProduct,
		onToggleIsSendingOrder,
		onToggleIsPrinting,
		isOpen,
	} = useModalsStore((state) => ({
		isOpen: state.isOpen,
		onToggleIsCreatingProduct: state.onToggleIsCreatingProduct,
		onToggleIsSendingOrder: state.onToggleIsSendingOrder,
		onToggleIsPrinting: state.onToggleIsPrinting,
	}));

	const [searchParams] = useSearchParams();
	const { filter: supplier = '' } = parseSearchParams(searchParams);
	// Queries
	const { products } = useGetAllProductsBySupplierName(supplier);

	// Mutations
	const { onResetOrderAmount } =
		useResetProductsOrderAmountByIds(setRowSelection);
	const { onDeleteByIds } = useDeleteProductsByIds(setRowSelection);
	const selectedProducts = products
		?.filter((_, index) => rowSelection[index])
		.map(({ id }) => id);
	const { isLoading: isLoadingDeleteByIds } =
		useDeleteProductsByIds(setRowSelection);
	const { isLoading: isLoadingResetOrderAmount } =
		useResetProductsOrderAmountByIds(setRowSelection);

	// Disables
	const { isValidToOrder, moreThanOneSupplier } =
		useIsValidToOrder();
	const disableDelete =
		!products?.length || !Object.keys(rowSelection)?.length;
	const disableOrder = !isValidToOrder || moreThanOneSupplier;
	const disableResetOrderAmount = [
		!isValidToOrder,
		isLoadingResetOrderAmount,
		!Object.keys(rowSelection)?.length,
	].some(Boolean);

	// Callbacks
	const onDeleteSelectedProducts = useCallback(async () => {
		if (!selectedProducts?.length) return;

		await onDeleteByIds({
			ids: selectedProducts,
		});
	}, [onDeleteByIds, selectedProducts?.length]);
	const resetOrderAmount = useCallback(() => {
		if (!selectedProducts?.length) return;
		//
		return onResetOrderAmount({
			ids: selectedProducts,
		});
	}, [selectedProducts?.length, onResetOrderAmount]);

	return {
		disableOrder,
		moreThanOneSupplier,
		onToggleIsSendingOrder,
		selectedProducts,
		disableResetOrderAmount,
		isLoadingResetOrderAmount,
		resetOrderAmount,
		disableDelete,
		isLoadingDeleteByIds,
		onDeleteSelectedProducts,
		onToggleIsPrinting,
		onToggleIsCreatingProduct,
		isOpen,
	};
};

import { useToggle } from 'react-use';
import {
	useDeleteProductsByIds,
	useGetAllProducts,
	useIsValidToOrder,
	useResetProductsOrderAmountByIds,
} from '../../../../products.api';
import { Dispatch, SetStateAction, useCallback } from 'react';

export const useProductsActions = (
	rowSelection: Record<PropertyKey, boolean>,
	setRowSelection: Dispatch<
		SetStateAction<Record<PropertyKey, boolean>>
	>,
) => {
	// Modal toggles
	const [isSendingOrder, toggleIsSendingOrder] = useToggle(false);
	const [isPrinting, toggleIsPrinting] = useToggle(false);
	const [isCreatingProduct, toggleIsCreatingProduct] =
		useToggle(false);

	// Queries
	const { products } = useGetAllProducts();

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
		//
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
		isSendingOrder,
		toggleIsSendingOrder,
		selectedProducts,
		disableResetOrderAmount,
		isLoadingResetOrderAmount,
		resetOrderAmount,
		disableDelete,
		isLoadingDeleteByIds,
		onDeleteSelectedProducts,
		isCreatingProduct,
		isPrinting,
		toggleIsPrinting,
		toggleIsCreatingProduct,
	};
};

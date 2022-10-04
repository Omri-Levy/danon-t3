import { SendOrderModal } from '../../../organisms/SendOrderModal/SendOrderModal';
import clsx from 'clsx';
import { locale } from '../../../../translations';
import { CreateProductModal } from '../../../organisms/CreateProductModal/CreateProductModal';
import { PrintModal } from '../../../organisms/PrintModal/PrintModal';
import { useToggle } from 'react-use';
import {
	useDeleteProductsByIds,
	useGetAllProducts,
	useResetProductsOrderAmountByIds,
} from '../../../../api/products-api';
import { useCallback } from 'react';

export const HomeActions = ({ rowSelection, setRowSelection }) => {
	// Modal toggles
	const [isSendingOrder, toggleIsSendingOrder] = useToggle(false);
	const [isPrinting, toggleIsPrinting] = useToggle(false);
	const [isCreatingProduct, toggleIsCreatingProduct] =
		useToggle(false);

	// Queries
	// const productsToOrderSelector = useProductsToOrder();
	const { products: productsToOrder } = useGetAllProducts({
		// select: productsToOrderSelector,
	});

	// Mutations
	const { onResetOrderAmount } =
		useResetProductsOrderAmountByIds(setRowSelection);
	const { onDeleteByIds } = useDeleteProductsByIds(setRowSelection);
	const selectedProducts = productsToOrder
		?.filter((_, index) => rowSelection[index])
		.map(({ id }) => id);
	const { isLoading: isLoadingDeleteByIds } =
		useDeleteProductsByIds(setRowSelection);
	const { isLoading: isLoadingResetOrderAmount } =
		useResetProductsOrderAmountByIds(setRowSelection);

	// Disables
	const moreThanOneSupplier =
		new Set(productsToOrder?.map(({ supplierId }) => supplierId))
			.size > 1;
	// const isValidToOrder = useIsValidToOrder();
	const isValidToOrder = false;
	const disableDelete =
		!productsToOrder?.length ||
		!Object.keys(rowSelection)?.length;
	const disableOrder = !isValidToOrder || moreThanOneSupplier;
	const disableResetOrderAmount = [
		!productsToOrder?.length,
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

	return (
		<>
			<div
				className={disableOrder ? `tooltip` : `inline`}
				data-tip={
					moreThanOneSupplier
						? `לא ניתן לבצע הזמנה עם יותר מספק אחד עם כמות הזמנה מעל ל0`
						: `לא ניתן לבצע הזמנה ללא מוצרים עם כמות הזמנה מעל ל0`
				}
			>
				<SendOrderModal
					disabled={disableOrder}
					isOpen={isSendingOrder}
					onOpen={toggleIsSendingOrder}
				/>
			</div>
			<div
				className={
					!selectedProducts?.length ||
					disableResetOrderAmount
						? `tooltip`
						: `inline`
				}
				data-tip={
					disableResetOrderAmount
						? `לא ניתן לבצע איפוס כמות הזמנה ללא מוצרים עם כמות הזמנה מעל ל0`
						: `לא ניתן לבצע איפוס כמות הזמנה עם 0 מוצרים מסומנים`
				}
			>
				<button
					disabled={disableResetOrderAmount}
					className={clsx([
						`btn`,
						{
							loading: isLoadingResetOrderAmount,
						},
					])}
					onClick={resetOrderAmount}
				>
					{locale.he.resetOrderAmount}
				</button>
			</div>
			<div
				className={disableDelete ? `tooltip` : `inline`}
				data-tip={`לא ניתן לבצע מחיקת מוצרים עם 0 מוצרים מסומנים`}
			>
				<button
					disabled={disableDelete}
					className={clsx([
						`btn`,
						{ loading: isLoadingDeleteByIds },
					])}
					onClick={onDeleteSelectedProducts}
				>
					{locale.he.delete}
				</button>
			</div>
			<CreateProductModal
				isOpen={isCreatingProduct}
				onOpen={toggleIsCreatingProduct}
			/>
			<PrintModal
				isOpen={isPrinting}
				onOpen={toggleIsPrinting}
			/>
		</>
	);
};

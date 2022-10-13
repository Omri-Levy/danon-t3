import clsx from 'clsx';
import { locale } from '../../../common/translations';
import { FunctionComponent } from 'react';
import { useProductsActions } from './hooks/useProductsActions/useProductsActions';
import { IProductsActionsProps } from './interfaces';
import { ModalButton } from '../../../common/components/molecules/Modal/ModalButton/ModalButton';

export const ProductsActions: FunctionComponent<
	IProductsActionsProps
> = ({ rowSelection, setRowSelection }) => {
	const {
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
		isOpen,
		onToggleIsPrinting,
		onToggleIsCreatingProduct,
	} = useProductsActions(rowSelection, setRowSelection);

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
				<ModalButton
					disabled={disableOrder}
					onOpen={onToggleIsSendingOrder}
					isOpen={isOpen}
				>
					{locale.he.order}
				</ModalButton>
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
					type={`button`}
				>
					{locale.he.delete}
				</button>
			</div>
			<ModalButton
				onOpen={onToggleIsCreatingProduct}
				isOpen={isOpen}
			>
				{locale.he.createProduct}
			</ModalButton>
			<ModalButton onOpen={onToggleIsPrinting} isOpen={isOpen}>
				{locale.he.print}
			</ModalButton>
		</>
	);
};

import { SendOrderModal } from '../SendOrderModal/SendOrderModal';
import clsx from 'clsx';
import { locale } from '../../../common/translations';
import { CreateProductModal } from '../CreateProductModal/CreateProductModal';
import { PrintModal } from '../PrintModal/PrintModal';
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
				<SendOrderModal
					isOpen={isSendingOrder}
					onOpen={toggleIsSendingOrder}
				/>
				<ModalButton
					disabled={disableOrder}
					isOpen={isSendingOrder}
					onOpen={toggleIsSendingOrder}
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
			<CreateProductModal
				isOpen={isCreatingProduct}
				onOpen={toggleIsCreatingProduct}
			/>
			<ModalButton
				onOpen={toggleIsCreatingProduct}
				isOpen={isCreatingProduct}
			>
				{locale.he.createProduct}
			</ModalButton>
			<PrintModal
				isOpen={isPrinting}
				onOpen={toggleIsPrinting}
			/>
			<ModalButton
				isOpen={isPrinting}
				onOpen={toggleIsPrinting}
			>
				{locale.he.print}
			</ModalButton>
		</>
	);
};

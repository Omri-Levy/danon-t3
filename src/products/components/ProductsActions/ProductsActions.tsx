import clsx from 'clsx';
import { locale } from '../../../common/translations';
import { FunctionComponent } from 'react';
import { useProductsActions } from './hooks/useProductsActions/useProductsActions';
import { IProductsActionsProps } from './interfaces';
import { ModalButton } from '../../../common/components/molecules/Modal/ModalButton/ModalButton';

export const ProductsActions: FunctionComponent<
	IProductsActionsProps
> = ({ rowSelection }) => {
	const {
		disableOrder,
		moreThanOneSupplier,
		onToggleIsSendingOrder,
		selectedProductsIds,
		disableResetOrderAmount,
		isLoadingResetOrderAmount,
		resetOrderAmount,
		disableDelete,
		isLoadingDeleteByIds,
		onToggleIsDeletingSelectedProducts,
		isOpen,
		onToggleIsPrinting,
		onToggleIsCreatingProduct,
	} = useProductsActions(rowSelection);

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
					className={`btn gap-2`}
				>
					{locale.he.order}
					<svg
						xmlns='http://www.w3.org/2000/svg'
						viewBox='0 0 20 20'
						fill='currentColor'
						className='w-5 h-5'
					>
						<path d='M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z' />
						<path d='M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z' />
					</svg>
				</ModalButton>
			</div>
			<div
				className={
					!selectedProductsIds?.length ||
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
						`btn gap-2`,
						{
							loading: isLoadingResetOrderAmount,
						},
					])}
					onClick={resetOrderAmount}
				>
					{locale.he.resetOrderAmount}
					<svg
						xmlns='http://www.w3.org/2000/svg'
						viewBox='0 0 20 20'
						fill='currentColor'
						className='w-5 h-5'
					>
						<path
							fillRule='evenodd'
							d='M7.793 2.232a.75.75 0 01-.025 1.06L3.622 7.25h10.003a5.375 5.375 0 010 10.75H10.75a.75.75 0 010-1.5h2.875a3.875 3.875 0 000-7.75H3.622l4.146 3.957a.75.75 0 01-1.036 1.085l-5.5-5.25a.75.75 0 010-1.085l5.5-5.25a.75.75 0 011.06.025z'
							clipRule='evenodd'
						/>
					</svg>
				</button>
			</div>
			<div
				className={disableDelete ? `tooltip` : `inline`}
				data-tip={`לא ניתן לבצע מחיקת מוצרים עם 0 מוצרים מסומנים`}
			>
				<ModalButton
					disabled={disableDelete}
					className={clsx([
						`btn gap-2`,
						{ loading: isLoadingDeleteByIds },
					])}
					onOpen={onToggleIsDeletingSelectedProducts}
					isOpen={isOpen}
				>
					{locale.he.delete}
					<svg
						xmlns='http://www.w3.org/2000/svg'
						viewBox='0 0 20 20'
						fill='currentColor'
						className='w-5 h-5'
					>
						<path
							fillRule='evenodd'
							d='M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z'
							clipRule='evenodd'
						/>
					</svg>
				</ModalButton>
			</div>
			<ModalButton
				onOpen={onToggleIsCreatingProduct}
				isOpen={isOpen}
				className={`btn gap-2`}
			>
				{locale.he.createProduct}
				<svg
					xmlns='http://www.w3.org/2000/svg'
					viewBox='0 0 20 20'
					fill='currentColor'
					className='w-5 h-5'
				>
					<path d='M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z' />
				</svg>
			</ModalButton>
			<ModalButton
				onOpen={onToggleIsPrinting}
				isOpen={isOpen}
				className={`btn gap-2`}
			>
				{locale.he.print}
				<svg
					xmlns='http://www.w3.org/2000/svg'
					viewBox='0 0 20 20'
					fill='currentColor'
					className='w-5 h-5'
				>
					<path
						fillRule='evenodd'
						d='M5 2.75C5 1.784 5.784 1 6.75 1h6.5c.966 0 1.75.784 1.75 1.75v3.552c.377.046.752.097 1.126.153A2.212 2.212 0 0118 8.653v4.097A2.25 2.25 0 0115.75 15h-.241l.305 1.984A1.75 1.75 0 0114.084 19H5.915a1.75 1.75 0 01-1.73-2.016L4.492 15H4.25A2.25 2.25 0 012 12.75V8.653c0-1.082.775-2.034 1.874-2.198.374-.056.75-.107 1.127-.153L5 6.25v-3.5zm8.5 3.397a41.533 41.533 0 00-7 0V2.75a.25.25 0 01.25-.25h6.5a.25.25 0 01.25.25v3.397zM6.608 12.5a.25.25 0 00-.247.212l-.693 4.5a.25.25 0 00.247.288h8.17a.25.25 0 00.246-.288l-.692-4.5a.25.25 0 00-.247-.212H6.608z'
						clipRule='evenodd'
					/>
				</svg>
			</ModalButton>
		</>
	);
};

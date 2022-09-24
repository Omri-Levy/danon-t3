import { locale } from '../../../translations';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { SendOrderModal } from '../../organisms/SendOrderModal/SendOrderModal';
import { PrintModal } from '../../organisms/PrintModal/PrintModal';
import { CreateProductModal } from '../../organisms/CreateProductModal/CreateProductModal';
import clsx from 'clsx';
import { createProductsApi } from '../../../api/products-api';
import { useToggle } from 'react-use';

export const TopBar = ({
	globalFilter,
	onGlobalFilter,
	productsCount,
	rowSelection,
	setRowSelection,
}) => {
	const [isSendingOrder, toggleIsSendingOrder] = useToggle(false);
	const [isPrinting, toggleIsPrinting] = useToggle(false);
	const [isCreatingProduct, toggleIsCreatingProduct] =
		useToggle(false);
	const productsApi = createProductsApi();
	const { products: productsToOrder } =
		productsApi.getAllForOrder();
	const { products } = productsApi.getAll();
	const moreThanOneSupplier =
		new Set(productsToOrder?.map(({ supplierId }) => supplierId))
			.size > 1;
	const isValidToOrder = productsApi.isValidToOrder();
	const onSignOut = () => signOut();
	const {
		isLoading: isLoadingResetOrderAmount,
		onResetOrderAmount,
	} =
		productsApi.resetOrderAmountByIds<
			Record<PropertyKey, boolean>
		>(setRowSelection);
	const { isLoading: isLoadingDeleteByIds } =
		productsApi.deleteByIds();
	const { status } = useSession();
	const isLoadingSession = status === 'loading';
	const { onDeleteByIds } =
		productsApi.deleteByIds<Record<PropertyKey, boolean>>(
			setRowSelection,
		);
	const selectedProducts = products
		?.filter((_, index) => rowSelection[index])
		.map(({ id }) => id);
	const onDeleteSelectedProducts = async () => {
		if (!selectedProducts?.length) return;

		await onDeleteByIds({
			ids: selectedProducts,
		});
	};
	const disableDelete =
		!products?.length || !Object.keys(rowSelection)?.length;
	const disableOrder = !isValidToOrder || moreThanOneSupplier;
	const disableResetOrderAmount = [
		!selectedProducts?.length,
		!products?.length,
		!isValidToOrder,
		isLoadingResetOrderAmount,
		!Object.keys(rowSelection)?.length,
	].some(Boolean);
	const resetOrderAmount = () => {
		if (!selectedProducts?.length) return;

		return onResetOrderAmount({
			ids: selectedProducts,
		});
	};

	return (
		<div className={`flex justify-between mb-1`}>
			<div className={`space-x-2 flex items-center`}>
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
						disableResetOrderAmount ? `tooltip` : `inline`
					}
					data-tip={
						!selectedProducts?.length
							? `לא ניתן לבצע איפוס כמות הזמנה עם 0 מוצרים מסומנים`
							: `לא ניתן לבצע איפוס כמות הזמנה ללא מוצרים עם כמות הזמנה מעל ל0`
					}
				>
					<button
						disabled={disableResetOrderAmount}
						className={clsx([
							`btn`,
							{ loading: isLoadingResetOrderAmount },
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
				<Link href={'/suppliers'} passHref>
					<a className={'btn'}>{locale.he.suppliers}</a>
				</Link>
				<PrintModal
					isOpen={isPrinting}
					onOpen={toggleIsPrinting}
				/>
			</div>
			<div className={`flex space-x-2 items-center`}>
				<div className='form-control'>
					<div className='input-group'>
						<input
							type='text'
							dir={`rtl`}
							placeholder={locale.he.search.replace(
								'$1',
								productsCount,
							)}
							className='input input-bordered'
							value={globalFilter ?? ''}
							onChange={onGlobalFilter}
						/>
						<div className='btn btn-square cursor-auto hover:bg-neutral'>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								className='h-6 w-6'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth='2'
									d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
								/>
							</svg>
						</div>
					</div>
				</div>
				<button
					className={clsx([
						`btn`,
						{ loading: isLoadingSession },
					])}
					onClick={onSignOut}
				>
					{locale.he.signOut}
				</button>
			</div>
		</div>
	);
};

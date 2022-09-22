import { locale } from '../../../translations';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { SendOrderModal } from '../../organisms/SendOrderModal/SendOrderModal';
import { PrintModal } from '../../organisms/PrintModal/PrintModal';
import { CreateProductModal } from '../../organisms/CreateProductModal/CreateProductModal';
import clsx from 'clsx';
import { createProductsApi } from '../../../api/products-api';

export const TopBar = ({
	isPrinting,
	isSendingOrder,
	isCreatingProduct,
	toggleIsPrinting,
	toggleIsSendingOrder,
	toggleIsCreatingProduct,
	orderAtleastOne,
	moreThanOneSupplier,
	productsLength,
	rowSelectionLength,
	globalFilter,
	onGlobalFilter,
	productsCount,
	onDeleteSelectedProducts,
	onResetOrderAmount,
}) => {
	const onSignOut = () => signOut();
	const productsApi = createProductsApi();
	const { isLoading: isLoadingResetOrderAmount } =
		productsApi.resetOrderAmount();
	const { isLoading: isLoadingDeleteByIds } =
		productsApi.deleteByIds();
	const { status } = useSession();
	const isLoadingSession = status === 'loading';

	return (
		<div className={`flex justify-between mb-1`}>
			<div className={`space-x-2 flex items-center`}>
				<div
					className={
						!orderAtleastOne || moreThanOneSupplier
							? `tooltip`
							: `inline`
					}
					data-tip={
						moreThanOneSupplier
							? `לא ניתן לבצע הזמנה עם יותר מספק אחד עם כמות הזמנה מעל ל0`
							: `לא ניתן לבצע הזמנה ללא מוצרים עם כמות הזמנה מעל ל0`
					}
				>
					<SendOrderModal
						disabled={
							!orderAtleastOne || moreThanOneSupplier
						}
						isOpen={isSendingOrder}
						onOpen={toggleIsSendingOrder}
					/>
				</div>
				<div
					className={
						!orderAtleastOne ? `tooltip` : `inline`
					}
					data-tip={`לא ניתן לבצע איפוס כמות הזמנה ללא מוצרים עם כמות הזמנה מעל ל0`}
				>
					<button
						disabled={
							!orderAtleastOne ||
							isLoadingResetOrderAmount
						}
						className={clsx([
							`btn`,
							{ loading: isLoadingResetOrderAmount },
						])}
						onClick={onResetOrderAmount}
					>
						{locale.he.resetOrderAmount}
					</button>
				</div>
				<div
					className={
						!productsLength || !rowSelectionLength
							? `tooltip`
							: `inline`
					}
					data-tip={`לא ניתן לבצע מחיקת מוצרים עם 0 מוצרים מסומנים`}
				>
					<button
						disabled={
							!productsLength || !rowSelectionLength
						}
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

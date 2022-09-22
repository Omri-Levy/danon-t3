import { locale } from '../../../translations';
import Link from 'next/link';

export const TopBar = ({
	toggleOnIsCreatingProduct,
	toggleOnIsSendingOrder,
	toggleOnIsPrinting,
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
	return (
		<div className={`flex justify-between`}>
			<div className={`space-x-2`}>
				<button
					className={'btn'}
					onClick={() => {
						toggleOnIsCreatingProduct();
					}}
				>
					{locale.he.createProduct}
				</button>
				<Link href={'/suppliers'} passHref>
					<a className={'btn'}>{locale.he.suppliers}</a>
				</Link>
				<button
					className={'btn'}
					onClick={() => {
						toggleOnIsPrinting();
					}}
				>
					{locale.he.print}
				</button>
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
					<button
						disabled={
							!orderAtleastOne || moreThanOneSupplier
						}
						className={'btn '}
						onClick={toggleOnIsSendingOrder}
					>
						{locale.he.order}
					</button>
				</div>
				<div
					className={
						!orderAtleastOne ? `tooltip` : `inline`
					}
					data-tip={`לא ניתן לבצע איפוס כמות הזמנה ללא מוצרים עם כמות הזמנה מעל ל0`}
				>
					<button
						disabled={!orderAtleastOne}
						className={'btn '}
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
						className={'btn '}
						onClick={onDeleteSelectedProducts}
					>
						{locale.he.delete}
					</button>
				</div>
			</div>
			<div className={`flex space-x-2`}>
				<div className='form-control mb-2'>
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
				<Link href={`/api/auth/signout`}>
					<a className={`btn`}>{locale.he.signOut}</a>
				</Link>
			</div>
		</div>
	);
};

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
		onToggleIsCreatingProduct,
		onUploadFile,
		fileInputRef,
		onExportCSV,
		onOpenFileExplorer,
	} = useProductsActions(rowSelection);

	return (
		<>
			<div
				className={clsx({
					tooltip: disableOrder,
				})}
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
					className={`btn btn-primary gap-2`}
					dir={`rtl`}
				>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						viewBox='0 0 24 24'
						fill='currentColor'
						className='w-5 h-5 rotate-180'
					>
						<path d='M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z' />
					</svg>

					<span>{locale.he.order}</span>
				</ModalButton>
			</div>
			<div className={`dropdown dropdown-hover dropdown-right`}>
				<label tabIndex={0} className='btn'>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						viewBox='0 0 20 20'
						fill='currentColor'
						className='w-5 h-5'
					>
						<path d='M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM11.5 15.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z' />
					</svg>
				</label>
				<ul
					className={`space-y-2 dropdown-content menu p-2 bg-base-100 rounded-box w-52 border shadow`}
					dir={`rtl`}
				>
					<li
						className={clsx({
							tooltip:
								!selectedProductsIds?.length ||
								disableResetOrderAmount,
							disabled: disableResetOrderAmount,
						})}
						data-tip={
							disableResetOrderAmount
								? `לא ניתן לבצע איפוס כמות הזמנה ללא מוצרים עם כמות הזמנה מעל ל0`
								: `לא ניתן לבצע איפוס כמות הזמנה עם 0 מוצרים מסומנים`
						}
					>
						<button
							disabled={disableResetOrderAmount}
							className={clsx([
								`w-full`,
								{
									loading:
										isLoadingResetOrderAmount,
								},
							])}
							onClick={resetOrderAmount}
						>
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
							{locale.he.resetOrderAmount}
						</button>
					</li>
					<li
						className={clsx({
							'tooltip disabled': disableDelete,
						})}
						data-tip={`לא ניתן לבצע מחיקת מוצרים עם 0 מוצרים מסומנים`}
					>
						<ModalButton
							disabled={disableDelete}
							className={clsx([
								`w-full`,
								{ loading: isLoadingDeleteByIds },
							])}
							onOpen={
								onToggleIsDeletingSelectedProducts
							}
							isOpen={isOpen}
						>
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
							{locale.he.delete}
						</ModalButton>
					</li>
					<li>
						<ModalButton
							onOpen={onToggleIsCreatingProduct}
							isOpen={isOpen}
							className={`w-full`}
						>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								viewBox='0 0 20 20'
								fill='currentColor'
								className='w-5 h-5'
							>
								<path d='M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z' />
							</svg>
							{locale.he.createProduct}
						</ModalButton>
					</li>
					<li>
						<button
							className={`w-full`}
							type={'button'}
							onClick={onOpenFileExplorer}
						>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								viewBox='0 0 20 20'
								fill='currentColor'
								className='w-5 h-5'
							>
								<path d='M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z' />
								<path d='M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z' />
							</svg>
							{locale.he.importProducts}
						</button>
						<input
							type={`file`}
							accept={`xlsx`}
							className={`hidden`}
							name={`csv`}
							ref={fileInputRef}
							onChange={onUploadFile}
						/>
					</li>

					<li>
						<button
							className={`w-full`}
							type={'button'}
							onClick={onExportCSV}
						>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								viewBox='0 0 20 20'
								fill='currentColor'
								className='w-5 h-5'
							>
								<path d='M9.25 13.25a.75.75 0 001.5 0V4.636l2.955 3.129a.75.75 0 001.09-1.03l-4.25-4.5a.75.75 0 00-1.09 0l-4.25 4.5a.75.75 0 101.09 1.03L9.25 4.636v8.614z' />
								<path d='M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z' />
							</svg>
							{locale.he.exportProducts}
						</button>
					</li>
				</ul>
			</div>
		</>
	);
};

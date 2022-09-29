import { locale } from '../../../translations';
import { createProductsApi } from '../../../api/products-api';
import * as Dialog from '@radix-ui/react-dialog';
import clsx from 'clsx';
import { usePdfTable } from '../../../hooks/usePdfTable/usePdfTable';

export const PrintModal = ({ isOpen, onOpen }) => {
	const productsApi = createProductsApi();
	const { products } = productsApi.getAll();
	const headers = [
		{
			accessorKey: 'stock',
			header: locale.he.stock,
		},
		{
			accessorKey: 'packageSize',
			header: locale.he.packageSize,
		},
		{
			accessorKey: 'unit',
			header: locale.he.unit,
		},
		{
			accessorKey: 'name',
			header: locale.he.productName,
		},
		{
			accessorKey: 'sku',
			header: locale.he.sku,
		},
		{
			accessorKey: 'supplier.name',
			header: locale.he.supplier,
		},
	].map(({ header, ...rest }) => ({
		header: header.split('').reverse().join(''),
		...rest,
	}));
	const base64 = usePdfTable(headers, products ?? []);

	return (
		<Dialog.Root open={isOpen} onOpenChange={onOpen}>
			<Dialog.Trigger className={'btn'}>
				{locale.he.print}
			</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay>
					<div
						className={clsx([
							`modal`,
							{
								[`modal-open`]: isOpen,
							},
						])}
					>
						<Dialog.Content
							className={`modal-box w-6/12 max-w-none h-full max-h-none`}
						>
							<div className={`flex justify-end`}>
								<Dialog.Close>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										viewBox='0 0 24 24'
										fill='currentColor'
										className='w-6 h-6'
									>
										<path
											fillRule='evenodd'
											d='M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z'
											clipRule='evenodd'
										/>
									</svg>
								</Dialog.Close>
							</div>
							<Dialog.Title
								dir={`rtl`}
								className={`font-bold text-center`}
							>
								{locale.he.print}
							</Dialog.Title>
							{!!products && (
								<iframe
									src={base64}
									className={`w-full h-[94%]`}
								/>
							)}
						</Dialog.Content>
					</div>
				</Dialog.Overlay>
			</Dialog.Portal>
		</Dialog.Root>
	);
};

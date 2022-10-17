import { locale } from '../../../common/translations';
import { FunctionComponent } from 'react';
import clsx from 'clsx';
import { Modal } from '../../../common/components/molecules/Modal/Modal';
import { useDeleteSelectedProductsModal } from './hooks/useDeleteSelectedProductsModal/useDeleteSelectedProductsModal';

export const DeleteSelectedProductsModal: FunctionComponent = () => {
	const {
		isOpen,
		onToggleIsDeletingSelectedProducts,
		isLoading,
		onDeleteSelectedProducts,
	} = useDeleteSelectedProductsModal();

	return (
		<Modal
			isOpen={isOpen}
			onOpen={onToggleIsDeletingSelectedProducts}
			title={locale.he.delete}
		>
			<p dir={`rtl`}>
				{locale.he.areYouSureYouWantToDeleteSelectedItems(
					`מוצרים`,
				)}
			</p>
			<button
				dir={`ltr`}
				className={clsx([
					'btn mt-2 mr-auto col-span-full gap-2',
					{ loading: isLoading },
				])}
				disabled={isLoading}
				onClick={onDeleteSelectedProducts}
				type={`submit`}
			>
				{locale.he.confirm}
				<svg
					xmlns='http://www.w3.org/2000/svg'
					viewBox='0 0 20 20'
					fill='currentColor'
					className='w-5 h-5'
				>
					<path
						fillRule='evenodd'
						d='M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z'
						clipRule='evenodd'
					/>
				</svg>
			</button>
		</Modal>
	);
};

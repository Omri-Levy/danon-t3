import clsx from 'clsx';
import { locale } from '../../../common/translations';
import { FunctionComponent } from 'react';
import { IOrdersActionsProps } from '../interfaces';
import { useOrdersActions } from './hooks/useOrdersActions/useOrdersActions';
import { ModalButton } from '../../../common/components/molecules/Modal/ModalButton/ModalButton';

export const OrdersActions: FunctionComponent<
	IOrdersActionsProps
> = ({ rowSelection }) => {
	const {
		disableDelete,
		isLoadingDeleteByIds,
		isOpen,
		onToggleIsDeletingSelectedOrders,
	} = useOrdersActions(rowSelection);

	return (
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
				isOpen={isOpen}
				onOpen={onToggleIsDeletingSelectedOrders}
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
	);
};

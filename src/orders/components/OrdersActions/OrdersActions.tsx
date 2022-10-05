import clsx from 'clsx';
import { locale } from '../../../common/translations';
import { FunctionComponent } from 'react';
import { IOrdersActionsProps } from '../interfaces';
import { useOrdersActions } from './hooks/useOrdersActions/useOrdersActions';

export const OrdersActions: FunctionComponent<
	IOrdersActionsProps
> = ({ rowSelection, setRowSelection }) => {
	const {
		disableDelete,
		isLoadingDeleteByIds,
		onDeleteSelectedOrders,
	} = useOrdersActions(rowSelection, setRowSelection);

	return (
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
				onClick={onDeleteSelectedOrders}
			>
				{locale.he.delete}
			</button>
		</div>
	);
};

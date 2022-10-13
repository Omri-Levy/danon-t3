import {
	useDeleteSuppliersByIds,
	useGetAllSuppliers,
} from '../../suppliers.api';
import clsx from 'clsx';
import { locale } from '../../../common/translations';
import { FunctionComponent } from 'react';
import { ISuppliersActionsProps } from './interfaces';
import { ModalButton } from '../../../common/components/molecules/Modal/ModalButton/ModalButton';
import { useModalsStore } from '../../../common/stores/modals/modals';

export const SuppliersActions: FunctionComponent<
	ISuppliersActionsProps
> = ({ rowSelection, setRowSelection }) => {
	const { suppliers } = useGetAllSuppliers();
	const selectedSuppliers = suppliers
		?.filter((_, index) => rowSelection[index])
		.map(({ id }) => id);
	const { onDeleteByIds, isLoading: isLoadingDeleteByIds } =
		useDeleteSuppliersByIds(setRowSelection);
	const onDeleteSelectedSuppliers = () => {
		if (!selectedSuppliers?.length) return;

		onDeleteByIds({
			ids: selectedSuppliers,
		});
	};
	const { onToggleIsCreatingSupplier, isOpen } = useModalsStore();

	return (
		<>
			<ModalButton
				onOpen={onToggleIsCreatingSupplier}
				isOpen={isOpen}
			>
				{locale.he.createSupplier}
			</ModalButton>
			<button
				disabled={
					!suppliers?.length ||
					!selectedSuppliers?.length ||
					isLoadingDeleteByIds
				}
				className={clsx([
					'btn',
					{ loading: isLoadingDeleteByIds },
				])}
				onClick={onDeleteSelectedSuppliers}
				type={`button`}
			>
				{locale.he.delete}
			</button>
		</>
	);
};

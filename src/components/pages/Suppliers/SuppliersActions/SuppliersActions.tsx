import { useToggle } from 'react-use';
import {
	useDeleteSuppliersByIds,
	useGetAllSuppliers,
} from '../../../../api/suppliers-api';
import { CreateSupplierModal } from '../../../organisms/CreateSupplierModal/CreateSupplierModal';
import clsx from 'clsx';
import { locale } from '../../../../translations';

export const SuppliersActions = ({
	rowSelection,
	setRowSelection,
}) => {
	const [isOpen, toggleIsOpen] = useToggle(false);
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

	return (
		<>
			<CreateSupplierModal
				isOpen={isOpen}
				onOpen={toggleIsOpen}
			/>
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
			>
				{locale.he.delete}
			</button>
		</>
	);
};

import {
	useDeleteSuppliersByIds,
	useGetAllSuppliers,
} from '../../../../suppliers.api';
import { useModalsStore } from '../../../../../common/stores/modals/modals';

export const useSuppliersActions = (
	rowSelection: Record<PropertyKey, boolean>,
) => {
	const { suppliers } = useGetAllSuppliers();
	const selectedSuppliers = suppliers
		?.filter((_, index) => rowSelection[index])
		.map(({ id }) => id);
	const { isLoading: isLoadingDeleteByIds } =
		useDeleteSuppliersByIds();
	const disableDelete = [
		!suppliers?.length,
		!selectedSuppliers?.length,
		isLoadingDeleteByIds,
	].some(Boolean);
	const {
		onToggleIsCreatingSupplier,
		onToggleIsDeletingSelectedSuppliers,
		isOpen,
	} = useModalsStore((state) => ({
		isOpen: state.isOpen,
		onToggleIsCreatingSupplier: state.onToggleIsCreatingSupplier,
		onToggleIsDeletingSelectedSuppliers:
			state.onToggleIsDeletingSelectedSuppliers,
	}));

	return {
		onToggleIsCreatingSupplier,
		isOpen,
		disableDelete,
		onToggleIsDeletingSelectedSuppliers,
		isLoadingDeleteByIds,
	};
};

import { useModalsStore } from '../../../../../common/stores/modals/modals';
import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
	useDeleteSuppliersByIds,
	useGetAllSuppliers,
} from '../../../../suppliers.api';
import { parseQueryString } from '../../../../../common/utils/parse-query-string/parse-query-string';
import { parseSearchParams } from '../../../../../products/components/ProductsTable/hooks/useProductsTable./useProductsTable';

export const useDeleteSelectedSuppliersModal = () => {
	const { isOpen, onToggleIsDeletingSelectedSuppliers } =
		useModalsStore((state) => ({
			isOpen: state.isOpen,
			onToggleIsDeletingSelectedSuppliers:
				state.onToggleIsDeletingSelectedSuppliers,
		}));
	const [searchParams] = useSearchParams();
	// Queries
	const { suppliers } = useGetAllSuppliers();
	const { onDeleteByIds, isLoading } = useDeleteSuppliersByIds(
		onToggleIsDeletingSelectedSuppliers,
	);
	const { selected } = parseSearchParams(searchParams);
	const rowSelection = parseQueryString(selected ?? '') ?? {};
	const selectedSuppliers = suppliers?.filter(
		(_, index) => rowSelection[index],
	);
	const selectedSuppliersIds = selectedSuppliers?.map(
		({ id }) => id,
	);
	const onDeleteSelectedSuppliers = useCallback(async () => {
		if (!selectedSuppliersIds?.length) return;

		await onDeleteByIds({
			ids: selectedSuppliersIds,
		});
	}, [onDeleteByIds, selectedSuppliersIds?.length]);

	return {
		isOpen,
		onToggleIsDeletingSelectedSuppliers,
		onDeleteByIds,
		isLoading,
		onDeleteSelectedSuppliers,
	};
};

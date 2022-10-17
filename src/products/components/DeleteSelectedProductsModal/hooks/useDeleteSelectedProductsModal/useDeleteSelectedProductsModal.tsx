import { useModalsStore } from '../../../../../common/stores/modals/modals';
import {
	useDeleteProductsByIds,
	useGetAllProductsBySupplierName,
} from '../../../../products.api';
import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { parseSearchParams } from '../../../ProductsTable/hooks/useProductsTable./useProductsTable';
import { parseQueryString } from '../../../../../common/utils/parse-query-string/parse-query-string';

export const useDeleteSelectedProductsModal = () => {
	const { isOpen, onToggleIsDeletingSelectedProducts } =
		useModalsStore((state) => ({
			isOpen: state.isOpen,
			onToggleIsDeletingSelectedProducts:
				state.onToggleIsDeletingSelectedProducts,
		}));
	const [searchParams] = useSearchParams();
	const { filter: supplier = '' } = parseSearchParams(searchParams);
	// Queries
	const { products } = useGetAllProductsBySupplierName(supplier);
	const { onDeleteByIds, isLoading } = useDeleteProductsByIds(
		onToggleIsDeletingSelectedProducts,
	);
	const { selected } = parseSearchParams(searchParams);
	const rowSelection = parseQueryString(selected ?? '') ?? {};
	const selectedProducts = products?.filter(
		(_, index) => rowSelection[index],
	);
	const selectedProductsIds = selectedProducts?.map(({ id }) => id);
	const onDeleteSelectedProducts = useCallback(async () => {
		if (!selectedProductsIds?.length) return;

		await onDeleteByIds({
			ids: selectedProductsIds,
		});
	}, [onDeleteByIds, selectedProductsIds?.length]);

	return {
		isOpen,
		onToggleIsDeletingSelectedProducts,
		onDeleteByIds,
		isLoading,
		onDeleteSelectedProducts,
	};
};

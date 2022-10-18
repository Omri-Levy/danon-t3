import {
	useDeleteProductsByIds,
	useGetAllProductsBySupplierName,
	useImportCSV,
	useIsValidToOrder,
	useResetProductsOrderAmountByIds,
} from '../../../../products.api';
import { ChangeEventHandler, useCallback, useRef } from 'react';
import { useModalsStore } from '../../../../../common/stores/modals/modals';
import { useSearchParams } from 'react-router-dom';
import { parseSearchParams } from '../../../ProductsTable/hooks/useProductsTable./useProductsTable';
import * as XLSX from 'xlsx';
import { getLocaleDateString } from '../../../../../common/utils/get-locale-date-string/get-locale-date-string';

export const useProductsActions = (
	rowSelection: Record<PropertyKey, boolean>,
) => {
	// Modal toggles
	const {
		onToggleIsCreatingProduct,
		onToggleIsSendingOrder,
		onToggleIsPrinting,
		onToggleIsDeletingSelectedProducts,
		isOpen,
	} = useModalsStore((state) => ({
		isOpen: state.isOpen,
		onToggleIsCreatingProduct: state.onToggleIsCreatingProduct,
		onToggleIsSendingOrder: state.onToggleIsSendingOrder,
		onToggleIsPrinting: state.onToggleIsPrinting,
		onToggleIsDeletingSelectedProducts:
			state.onToggleIsDeletingSelectedProducts,
	}));

	const [searchParams] = useSearchParams();
	const { filter: supplier = '' } = parseSearchParams(searchParams);
	// Queries
	const { products } = useGetAllProductsBySupplierName(supplier);

	// Mutations
	const {
		onResetOrderAmount,
		isLoading: isLoadingResetOrderAmount,
	} = useResetProductsOrderAmountByIds();
	const selectedProducts = products?.filter(
		(_, index) => rowSelection[index],
	);
	const selectedProductsIds = selectedProducts?.map(({ id }) => id);
	const { isLoading: isLoadingDeleteByIds } =
		useDeleteProductsByIds(onToggleIsDeletingSelectedProducts);

	// Disables
	const { isValidToOrder, moreThanOneSupplier } =
		useIsValidToOrder();
	const disableDelete =
		!products?.length || !Object.keys(rowSelection)?.length;
	const disableOrder = !isValidToOrder || moreThanOneSupplier;
	const disableResetOrderAmount = [
		!isValidToOrder,
		isLoadingResetOrderAmount,
		!Object.keys(rowSelection)?.length,
		!selectedProducts?.filter(
			({ orderAmount }) => parseFloat(orderAmount) > 0,
		)?.length,
	].some(Boolean);

	// Callbacks
	const resetOrderAmount = useCallback(() => {
		if (!selectedProductsIds?.length) return;

		return onResetOrderAmount({
			ids: selectedProductsIds,
		});
	}, [selectedProductsIds?.length, onResetOrderAmount]);
	const { onImportCSV } = useImportCSV();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const onUploadFile: ChangeEventHandler<HTMLInputElement> =
		useCallback(
			(e) => {
				const [file] = e.target?.files ?? [];

				if (!file) return;

				const reader = new FileReader();

				reader.addEventListener(`load`, async (e) => {
					const data = e.target?.result;

					return onImportCSV({
						file: data,
					});
				});
				reader.readAsBinaryString(file);
				e.target.value = '';
			},
			[onImportCSV],
		);
	const onExportCSV = useCallback(() => {
		if (!products?.length) return;

		const cleanedProducts = products.map(
			({
				supplier,
				sku,
				name,
				unit,
				packageSize,
				orderAmount,
				stock,
			}) => ({
				מלאי: stock,
				'כמות הזמנה': orderAmount,
				'גודל אריזה': packageSize,
				יחידה: unit,
				'שם מוצר': name,
				'מק"ט': sku,
				ספק: supplier.name,
			}),
		);
		const workbook = XLSX.utils.book_new();
		const worksheet = XLSX.utils.json_to_sheet(cleanedProducts);

		XLSX.utils.book_append_sheet(workbook, worksheet, `מוצרים`);

		XLSX.writeFile(
			workbook,
			`danon_${getLocaleDateString()}.xlsx`,
		);
	}, []);

	return {
		disableOrder,
		moreThanOneSupplier,
		onToggleIsSendingOrder,
		selectedProductsIds,
		disableResetOrderAmount,
		isLoadingResetOrderAmount,
		resetOrderAmount,
		disableDelete,
		isLoadingDeleteByIds,
		onToggleIsPrinting,
		onToggleIsCreatingProduct,
		onToggleIsDeletingSelectedProducts,
		isOpen,
		onUploadFile,
		fileInputRef,
		onExportCSV,
	};
};

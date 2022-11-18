import { locale } from '../../../common/translations';
import { usePdfTable } from '../../hooks/usePdfTable/usePdfTable';
import { useGetAllProducts } from '../../products.api';
import { FunctionComponent, useMemo } from 'react';
import { Modal } from '../../../common/components/molecules/Modal/Modal';
import { useModalsStore } from '../../../common/stores/modals/modals';
import produce from 'immer';
import { addRowIndex } from '../../../common/utils/add-row-index/add-row-index';

export const PrintProductsModal: FunctionComponent = () => {
	const { isOpen, onToggleIsPrinting } = useModalsStore(
		(state) => ({
			isOpen: state.isOpen,
			onToggleIsPrinting: state.onToggleIsPrintingProducts,
		}),
	);
	const { products } = useGetAllProducts();
	const headers = useMemo(
		() =>
			[
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
				{
					accessorKey: 'rowIndex',
					header: '',
				},
			].map(({ header, ...rest }) => ({
				header: header.split('').reverse().join(''),
				...rest,
			})),
		[],
	);
	const dividedBySupplier = (data: typeof products) => {
		const entries = produce<Record<PropertyKey, typeof products>>(
			{},
			(draft) => {
				data?.forEach((product, index) => {
					if (draft[product.supplier.name]) {
						draft[product.supplier.name]?.push(product);

						return;
					}

					draft[product.supplier.name] = [product];
				});
			},
		);

		return Object.keys(entries)
			?.sort((a, b) => a.localeCompare(b))
			.map((key) => entries[key]?.flatMap(addRowIndex));
	};
	const data = dividedBySupplier(products);
	const base64 = usePdfTable(headers, data);

	return (
		<Modal
			isOpen={isOpen}
			onOpen={onToggleIsPrinting}
			title={locale.he.print}
			contentProps={{
				className:
					'2xl:w-6/12 max-w-[70%] h-full\n							 max-h-960px:p-2 max-h-960px:max-h-[calc(100%-0.5em)]',
			}}
		>
			{!!products?.length && (
				<iframe
					src={base64?.toString()}
					className={`w-full h-[93%]`}
				/>
			)}
		</Modal>
	);
};

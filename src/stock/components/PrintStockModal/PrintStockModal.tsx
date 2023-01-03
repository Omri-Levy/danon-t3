import { locale } from '../../../common/translations';
import { usePdfTable } from '../../hooks/usePdfTable/usePdfTable';
import { useGetAllProducts } from '../../stock.api';
import { FunctionComponent, useMemo } from 'react';
import { Modal } from '../../../common/components/molecules/Modal/Modal';
import { useModalsStore } from '../../../common/stores/modals/modals';
import produce from 'immer';
import { addRowIndex } from '../../../common/utils/add-row-index/add-row-index';
import { toShekels } from '../../../common/utils/to-shekels/to-shekels';
import { reverseIfHebrew } from '../../../common/utils/reverse-if-hebrew/reverse-if-hebrew';
import { TProductGetByIdOutput } from '../../../common/types';

export const PrintStockModal: FunctionComponent = () => {
	const { isOpen, onToggleIsPrintingStock } = useModalsStore(
		(state) => ({
			isOpen: state.isOpen,
			onToggleIsPrintingStock: state.onToggleIsPrintingStock,
		}),
	);
	const { products } = useGetAllProducts();
	const headers = useMemo(
		() =>
			[
				{
					accessorKey: 'cost',
					header: locale.he.cost,
				},
				{
					accessorKey: 'stock',
					header: locale.he.stock,
				},
				{
					accessorKey: 'pricePerUnit',
					header: locale.he.pricePerUnit,
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
				header: reverseIfHebrew(header),
				...rest,
			})),
		[],
	);
	const productKeys = Object.keys(products?.[0] ?? {}) as Array<
		keyof TProductGetByIdOutput
	>;
	const withRtl = useMemo(
		() =>
			products?.flatMap((product) =>
				productKeys.reduce<Record<PropertyKey, any>>(
					(acc, key) => {
						acc[key] = reverseIfHebrew(product[key]);

						return acc;
					},
					{},
				),
			),
		[productKeys, products],
	);
	const toDivide = withRtl?.map(
		({ cost, pricePerUnit, ...rest }) => ({
			cost: toShekels(cost),
			pricePerUnit: toShekels(pricePerUnit),
			...rest,
		}),
	);
	const dividedBySupplier = (data: typeof toDivide) => {
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
	const data = dividedBySupplier(toDivide);
	const base64 = usePdfTable(headers, data);

	return (
		<Modal
			isOpen={isOpen}
			onOpen={onToggleIsPrintingStock}
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

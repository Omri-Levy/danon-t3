import { locale } from '../../../common/translations';
import { usePdfTable } from '../../hooks/usePdfTable/usePdfTable';
import { useGetAllProducts } from '../../products.api';
import { FunctionComponent, useMemo } from 'react';
import { IPrintModalProps } from './interfaces';
import { addRowIndex } from '../../../common/utils/add-row-index/add-row-index';
import { Modal } from '../../../common/components/molecules/Modal/Modal';

export const PrintModal: FunctionComponent<IPrintModalProps> = ({
	isOpen,
	onOpen,
}) => {
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
	const withRowIndex = useMemo(
		() => products?.map(addRowIndex),
		[products],
	);
	const base64 = usePdfTable(headers, withRowIndex ?? []);

	return (
		<Modal
			isOpen={isOpen}
			onOpen={onOpen}
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

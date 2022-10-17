import { useModalsStore } from '../../../../../common/stores/modals/modals';
import { useGetAllProductsToOrder } from '../../../../products.api';
import {
	useGetAllOrders,
	useSendOrder,
} from '../../../../../orders/orders.api';
import { useCallback, useEffect, useMemo } from 'react';
import { locale } from '../../../../../common/translations';
import { addRowIndex } from '../../../../../common/utils/add-row-index/add-row-index';
import { usePdfTable } from '../../../../hooks/usePdfTable/usePdfTable';
import { SubmitHandler, useForm } from 'react-hook-form';
import { TOrderSendInput } from '../../../../../common/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { sendOrderSchema } from '../../../../../orders/validation';
import { getForm } from '../../../../../common/components/molecules/Form/get-form';
import { ISendOrderFormFields } from '../../interfaces';

export const useSendOrderModal = () => {
	const { isOpen, onToggleIsSendingOrder } = useModalsStore(
		(state) => ({
			isOpen: state.isOpen,
			onToggleIsSendingOrder: state.onToggleIsSendingOrder,
		}),
	);
	const { products } = useGetAllProductsToOrder();
	const { onSend, isSuccess, isLoading } = useSendOrder();
	const headers = useMemo(
		() =>
			[
				{
					accessorKey: 'orderAmount',
					header: locale.he.orderAmount,
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
					accessorKey: 'rowIndex',
					header: '',
				},
			].map(({ header, ...rest }) => ({
				header: header.split('').reverse().join(''),
				...rest,
			})),
		[],
	);
	const { orders } = useGetAllOrders();
	const nextOrder = ((orders?.at(-1)?.orderNumber ?? 0) + 1)
		.toString()
		.padStart(5, '0');
	const withRowIndex = useMemo(
		() => products?.map(addRowIndex),
		[products],
	);
	const base64 = usePdfTable(
		headers,
		withRowIndex ?? [],
		`הזמנה מספר ${nextOrder}`.split('').reverse().join(''),
	);
	const onSendOrderSubmit: SubmitHandler<TOrderSendInput> =
		useCallback(async () => {
			if (!products?.length) return;

			await onSend({
				pdf: base64,
			});
		}, [onSend, products?.length]);
	const sendOrderMethods = useForm({
		mode: 'all',
		criteriaMode: 'all',
		resolver: zodResolver(sendOrderSchema),
		defaultValues: {
			pdf: '',
		},
	});

	useEffect(() => {
		if (!isSuccess) return;

		onToggleIsSendingOrder(false);
	}, [isSuccess]);
	const Form = getForm<ISendOrderFormFields>();

	return {
		isOpen,
		onToggleIsSendingOrder,
		products,
		base64,
		sendOrderMethods,
		onSendOrderSubmit,
		isLoading,
		Form,
	};
};

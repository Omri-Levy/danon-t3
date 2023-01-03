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
import {
	TOrderSendInput,
	TProductGetByIdOutput,
} from '../../../../../common/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { sendOrderSchema } from '../../../../../orders/validation';
import { getLocaleDateString } from '../../../../../common/utils/get-locale-date-string/get-locale-date-string';
import { reverseIfHebrew } from '../../../../../common/utils/reverse-if-hebrew/reverse-if-hebrew';

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
				header: reverseIfHebrew(header),
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
	const productKeys = Object.keys(withRowIndex?.[0] ?? {}) as Array<
		keyof TProductGetByIdOutput
	>;
	const withRtl = useMemo(
		() =>
			withRowIndex?.flatMap((product) =>
				productKeys.reduce<Record<PropertyKey, any>>(
					(acc, key) => {
						acc[key] = reverseIfHebrew(product[key]);

						return acc;
					},
					{},
				),
			),
		[productKeys, withRowIndex],
	);
	const base64 = usePdfTable(
		headers,
		[withRtl ?? []],
		reverseIfHebrew(
			`הזמנה מספר ${nextOrder} - ${getLocaleDateString()}`,
		),
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

	return {
		isOpen,
		onToggleIsSendingOrder,
		products,
		base64,
		sendOrderMethods,
		onSendOrderSubmit,
		isLoading,
	};
};

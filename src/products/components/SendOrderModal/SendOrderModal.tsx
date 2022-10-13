import { locale } from '../../../common/translations';
import {
	FormProvider,
	SubmitHandler,
	useForm,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TOrderSendInput } from '../../../common/types';
import {
	FunctionComponent,
	useCallback,
	useEffect,
	useMemo,
} from 'react';
import clsx from 'clsx';
import { usePdfTable } from '../../hooks/usePdfTable/usePdfTable';
import {
	useGetAllOrders,
	useSendOrder,
} from '../../../orders/orders.api';
import { useGetAllProductsToOrder } from '../../products.api';
import { sendOrderSchema } from '../../../orders/validation';
import { addRowIndex } from '../../../common/utils/add-row-index/add-row-index';
import { Modal } from '../../../common/components/molecules/Modal/Modal';
import { useModalsStore } from '../../../common/stores/modals/modals';

export const SendOrderModal: FunctionComponent = () => {
	const { isOpen, onToggleIsSendingOrder } = useModalsStore();
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

	return (
		<Modal
			isOpen={isOpen}
			onOpen={onToggleIsSendingOrder}
			title={locale.he.order}
			contentProps={{
				className: `2xl:w-6/12 max-w-[70%] h-full
max-h-960px:p-2 max-h-960px:max-h-[calc(100%-0.5em)]`,
			}}
		>
			{!!products?.length && (
				<iframe
					src={base64?.toString()}
					className={`w-full h-full max-h-[86%]`}
				/>
			)}
			<FormProvider {...sendOrderMethods}>
				<form
					noValidate
					onSubmit={sendOrderMethods.handleSubmit(
						onSendOrderSubmit,
					)}
				>
					<button
						className={clsx([
							`btn mt-2 mr-auto`,
							{ loading: isLoading },
						])}
						disabled={isLoading}
						type={`submit`}
					>
						{locale.he.send}
					</button>
				</form>
			</FormProvider>
		</Modal>
	);
};

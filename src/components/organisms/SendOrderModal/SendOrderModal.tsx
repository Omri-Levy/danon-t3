import { locale } from '../../../translations';
import {
	FormProvider,
	SubmitHandler,
	useForm,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createProductsApi } from '../../../api/products-api';
import { createOrdersApi } from '../../../api/orders-api';
import { InferMutationInput } from '../../../types';
import { sendOrderSchema } from '../../../server/orders/validation';
import { useCallback, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import clsx from 'clsx';
import { usePdfTable } from '../../../hooks/usePdfTable/usePdfTable';

export const SendOrderModal = ({ disabled, isOpen, onOpen }) => {
	const ordersApi = createOrdersApi();
	const productsApi = createProductsApi();
	const { products } = productsApi.getAllForOrder();
	const { onSend, isSuccess, isLoading } = ordersApi.send();
	const headers = [
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
	].map(({ header, ...rest }) => ({
		header: header.split('').reverse().join(''),
		...rest,
	}));
	const { orders } = ordersApi.getAll();
	const nextOrder = ((orders?.at(-1)?.orderNumber ?? 0) + 1)
		.toString()
		.padStart(5, '0');
	const base64 = usePdfTable(
		headers,
		products ?? [],
		`הזמנה מספר ${nextOrder}`.split('').reverse().join(''),
	);
	const onSendOrderSubmit: SubmitHandler<
		InferMutationInput<'orders.send'>
	> = useCallback(async () => {
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

		onOpen(false);
	}, [isSuccess]);

	return (
		<Dialog.Root open={isOpen} onOpenChange={onOpen}>
			<Dialog.Trigger className={'btn'} disabled={disabled}>
				{locale.he.order}
			</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay>
					<div
						className={clsx([
							`modal`,
							{
								[`modal-open`]: isOpen,
							},
						])}
					>
						<Dialog.Content
							className={`modal-box w-6/12 max-w-none h-full max-h-none`}
						>
							<div className={`flex justify-end`}>
								<Dialog.Close>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										viewBox='0 0 24 24'
										fill='currentColor'
										className='w-6 h-6'
									>
										<path
											fillRule='evenodd'
											d='M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z'
											clipRule='evenodd'
										/>
									</svg>
								</Dialog.Close>
							</div>
							<Dialog.Title
								dir={`rtl`}
								className={`font-bold text-center`}
							>
								{locale.he.order}
							</Dialog.Title>
							{!!products?.length && (
								<iframe
									src={base64}
									className={`w-full h-[86%]`}
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
						</Dialog.Content>
					</div>
				</Dialog.Overlay>
			</Dialog.Portal>
		</Dialog.Root>
	);
};

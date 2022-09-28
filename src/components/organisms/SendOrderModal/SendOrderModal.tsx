import { locale } from '../../../translations';
import {
	FormProvider,
	SubmitHandler,
	useForm,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ReactPDF, {
	Document,
	Image,
	Page,
	PDFViewer,
	StyleSheet,
	Text,
} from '@react-pdf/renderer';
import { createProductsApi } from '../../../api/products-api';
import { createOrdersApi } from '../../../api/orders-api';
import { InferMutationInput } from '../../../types';
import { ReactPdfTable } from '../../molecules/ReactPdfTable/ReactPdfTable';
import { sendOrderSchema } from '../../../server/orders/validation';
import { useCallback, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import clsx from 'clsx';
import pdf = ReactPDF.pdf;

const OrderDocument = ({ products }) => {
	const styles = StyleSheet.create({
		page: {
			position: 'relative',
			fontFamily: 'Heebo',
			fontSize: 11,
			flexDirection: 'column',
			alignItems: 'center',
			padding: '5px',
			height: '100%',
		},
		logo: {
			width: '120px',
			marginRight: 'auto',
			marginBottom: '10px',
		},
		footer: {
			position: 'absolute',
			bottom: '10px',
			width: '450px',
		},
	});
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
	];

	return (
		<Document>
			<Page size={`A4`} style={styles.page}>
				<Image src={'/danon-logo.png'} style={styles.logo} />
				<Text
					style={{
						fontSize: '24px',
						fontWeight: 'bold',
						textAlign: 'center',
					}}
				>
					הזמנה
				</Text>
				{!!products && (
					<ReactPdfTable
						headers={headers}
						data={products}
					/>
				)}
				<Image
					src={'/danon-footer.jpg'}
					style={styles.footer}
				/>
			</Page>
		</Document>
	);
};

export const SendOrderModal = ({ disabled, isOpen, onOpen }) => {
	const ordersApi = createOrdersApi();
	const productsApi = createProductsApi();
	const { products } = productsApi.getAllForOrder();
	const { onSend, isSuccess, isLoading } = ordersApi.send();
	const onSendOrderSubmit: SubmitHandler<
		InferMutationInput<'orders.send'>
	> = useCallback(async () => {
		if (!products?.length) return;

		const blob = await pdf(
			<OrderDocument products={products} />,
		).toBlob();
		const reader = new FileReader();
		reader.readAsDataURL(blob);
		reader.addEventListener(
			'loadend',
			async (e) => {
				const result = e.target?.result ?? null;

				await onSend({
					pdf: result,
				});
			},
			false,
		);
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
								{locale.he.print}
							</Dialog.Title>
							<PDFViewer
								height={`86%`}
								width={`100%`}
								style={{
									marginBottom: '10px',
								}}
							>
								<OrderDocument products={products} />
							</PDFViewer>
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

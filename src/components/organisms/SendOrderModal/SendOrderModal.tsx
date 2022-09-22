import { locale } from '../../../translations';
import {
	FormProvider,
	SubmitHandler,
	useForm,
} from 'react-hook-form';
import { Modal } from '../../molecules/Modal/Modal';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	Document,
	Image,
	Page,
	PDFViewer,
	StyleSheet,
	Text,
	usePDF,
} from '@react-pdf/renderer';
import { createProductsApi } from '../../../api/products-api';
import { createOrdersApi } from '../../../api/orders-api';
import { InferMutationInput } from '../../../types';
import { ReactPdfTable } from '../../molecules/ReactPdfTable/ReactPdfTable';
import { sendOrderSchema } from '../../../server/orders/validation';
import { useCallback } from 'react';

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

export const SendOrderModal = ({ isOpen, onClose }) => {
	const productsApi = createProductsApi();
	const ordersApi = createOrdersApi();
	const { products } = productsApi.getAllForOrder();
	const [{ blob }] = usePDF({
		document: <OrderDocument products={products} />,
	});
	const { onSend } = ordersApi.send();
	const onSendOrderSubmit: SubmitHandler<
		InferMutationInput<'orders.send'>
	> = useCallback(async () => {
		if (!blob) return;

		const reader = new FileReader();
		reader.readAsDataURL(blob);
		reader.addEventListener(
			'load',
			async (e) => {
				const result = e.target?.result ?? null;

				await onSend({
					pdf: result,
				});

				// setToast({
				// 	message: `Sending order: success`,
				// 	type: 'success',
				// });

				onClose();
			},
			false,
		);
	}, [blob, onClose, onSend]);
	const sendOrderMethods = useForm({
		mode: 'all',
		criteriaMode: 'all',
		resolver: zodResolver(sendOrderSchema),
		defaultValues: {
			pdf: '',
		},
	});
	// const blacklist = ['select', 'stock'];
	// const orderColumns = useReactTableToAutoTable(table, blacklist);
	// const orderBody = table
	// 	.getSortedRowModel()
	// 	.rows.filter(
	// 		(r) =>
	// 			!isBlacklisted(r.id, blacklist) &&
	// 			Number(r.getValue('orderAmount')) > 0,
	// 	)
	// 	.map((r, index) => addRowIndex(r.original, index));

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<h2 className={'text-3xl font-bold mb-2 text-center'}>
				{locale.he.order}
			</h2>
			<PDFViewer
				height={`100%`}
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
						(errors) => console.error(errors),
					)}
				>
					<button
						className={'btn mt-2 mr-auto'}
						type={`submit`}
					>
						{locale.he.send}
					</button>
				</form>
			</FormProvider>
		</Modal>
	);
};

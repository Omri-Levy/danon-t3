// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import ReactPDF, {
	Document,
	Font,
	Image,
	Page,
	PDFViewer,
	StyleSheet,
	Text,
	View,
} from '@react-pdf/renderer';
import { locale } from '../../../translations';
import { createProductsApi } from '../../../api/products-api';
import { ReactPdfTable } from '../../molecules/ReactPdfTable/ReactPdfTable';
import * as Dialog from '@radix-ui/react-dialog';
import clsx from 'clsx';

export const PrintModal = ({ isOpen, onOpen }) => {
	const productsApi = createProductsApi();
	const { products } = productsApi.getAll();
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
			accessorKey: 'stock',
			header: locale.he.stock,
			styles: {
				width: '70px',
			},
		},
		{
			accessorKey: 'packageSize',
			header: locale.he.packageSize,
			styles: {
				width: '70px',
			},
		},
		{
			accessorKey: 'unit',
			header: locale.he.unit,
			styles: {
				width: '70px',
			},
		},
		{
			accessorKey: 'name',
			header: locale.he.productName,
			styles: {
				width: '220px',
			},
		},
		{
			accessorKey: 'sku',
			header: locale.he.sku,
			styles: {
				width: '70px',
			},
		},
		{
			accessorKey: 'supplier.name',
			header: locale.he.supplier,
			styles: {
				width: '70px',
			},
		},
	];

	return (
		<Dialog.Root open={isOpen} onOpenChange={onOpen}>
			<Dialog.Trigger className={'btn'}>
				{locale.he.print}
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
							<PDFViewer height={`94%`} width={`100%`}>
								<Document>
									<Page
										size={`A4`}
										style={styles.page}
									>
										<Image
											src={'/danon-logo.png'}
											style={styles.logo}
										/>
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
							</PDFViewer>
						</Dialog.Content>
					</div>
				</Dialog.Overlay>
			</Dialog.Portal>
		</Dialog.Root>
	);
};

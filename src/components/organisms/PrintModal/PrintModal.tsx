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
import { Modal } from '../../molecules/Modal/Modal';
import { createProductsApi } from '../../../api/products-api';
import { ReactPdfTable } from '../../molecules/ReactPdfTable/ReactPdfTable';

export const PrintModal = ({ isOpen, onClose }) => {
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
		<Modal isOpen={isOpen} onClose={onClose}>
			<h2 className={'text-3xl font-bold mb-2 text-center'}>
				{locale.he.print}
			</h2>
			<PDFViewer height={`100%`}>
				<Document>
					<Page size={`A4`} style={styles.page}>
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
		</Modal>
	);
};

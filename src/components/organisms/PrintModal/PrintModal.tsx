// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {
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
import { trpc } from '../../../utils/trpc';
import { FunctionComponent } from 'react';

export const ReactPdfTable: FunctionComponent<{
	headers: Array<{
		accessorKey: string;
		header: string;
	}>;
	data: Array<any>;
}> = ({ headers, data }) => {
	const styles = StyleSheet.create({
		table: {
			flexWrap: 'wrap',
		},
		tr: {
			flexDirection: 'row',
		},
		thead: {
			flexDirection: 'row',
		},
		td: {
			border: '1px solid black',
			padding: '5px',
		},
		th: {
			textAlign: 'center',
			border: '1px solid black',
			padding: '5px',
			fontWeight: 'bold',
		},
	});

	return (
		<View style={styles.table}>
			<View style={styles.thead}>
				{headers?.map(({ header, accessorKey }, index) => (
					<Text
						key={`${accessorKey ?? index}-th`}
						style={{
							...styles.th,
							width: `${100 / headers.length}%`,
						}}
					>
						{header}
					</Text>
				))}
			</View>
			{data?.map((item, index) => (
				<View
					key={`${item?.id ?? index}-tr`}
					style={styles.tr}
				>
					{headers?.map(({ accessorKey }) => {
						const keys = accessorKey.split('.');
						let value = item;

						keys.forEach((key) => {
							value = value[key];
						});

						return (
							<Text
								key={`${accessorKey ?? index}-td`}
								style={{
									...styles.td,
									width: `${100 / headers.length}%`,
								}}
							>
								{value}
							</Text>
						);
					})}
				</View>
			))}
		</View>
	);
};

export const PrintModal = ({ isOpen, onClose }) => {
	const { data: products } =
		trpc.proxy.products.getProducts.useQuery();
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

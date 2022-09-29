import JsPdf from 'jspdf';
import autoTable from 'jspdf-autotable';
// Required for Hebrew, in addition to using reverse on Hebrew strings.
import './Heebo-normal';
import './Heebo-bold';
import { useEffect, useState } from 'react';

export const usePdfTable = (
	headers: Array<{ header: string; accessorKey: string }>,
	data: Array<Record<PropertyKey, any>>,
	text?: string,
) => {
	const [base64, setBase64] = useState<string | ArrayBuffer | null>(
		null,
	);
	const head = [headers.map(({ header }) => header)];
	const body = data.map((row) =>
		headers.map(({ accessorKey }) => {
			const keys = accessorKey.split('.');

			return keys.reduce((acc, key) => acc[key], row);
		}),
	);
	const margin = 45;
	const doc = new JsPdf('p', 'px', 'a4');
	const pdfHeight = doc.internal.pageSize.getHeight();
	const pdfWidth = doc.internal.pageSize.getWidth();
	const logo = new Image();
	const footer = new Image();

	logo.src = '/danon-logo.png';
	footer.src = '/danon-footer.jpg';

	if (text) {
		doc.setFont('Heebo-normal', 'normal');
		doc.text(text, pdfWidth / 2, 35, { align: 'center' });
	}

	doc.addImage(logo, 'PNG', 26, 5, 70, 70 / 2);
	doc.addImage(
		footer,
		'JPG',
		pdfWidth / 2 - 142,
		pdfHeight - margin,
		pdfWidth / 2 + 50,
		25,
	);

	autoTable(doc, {
		startY: margin,
		bodyStyles: {
			font: 'Heebo-normal',
		},
		headStyles: {
			halign: 'center',
			font: 'Heebo-bold',
		},
		head,
		body,
	});

	useEffect(() => {
		const blob = doc.output('blob');
		const reader = new FileReader();
		reader.readAsDataURL(blob);
		const onLoadEnd = () => {
			setBase64(reader.result);
		};

		reader.addEventListener('loadend', onLoadEnd);

		return () => {
			reader.removeEventListener('loadend', onLoadEnd);
		};
	}, [body?.length]);

	return base64;
};

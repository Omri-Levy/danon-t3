import JsPdf from 'jspdf';
import autoTable from 'jspdf-autotable';
// Required for Hebrew, in addition to using reverse on Hebrew strings.
import './Heebo-normal';
import './Heebo-bold';
import { useCallback, useState } from 'react';
import { useDeepCompareEffect } from 'react-use';

export const usePdfTable = (
	headers: Array<{ header: string; accessorKey: string }>,
	data: Array<Array<Record<PropertyKey, any>>>,
	text?: string,
) => {
	const [base64, setBase64] = useState<string | ArrayBuffer | null>(
		null,
	);
	const head = [headers.map(({ header }) => header)];
	const bodies = data?.map((entry) =>
		entry.map((row) =>
			headers.map(({ accessorKey }) => {
				const keys = accessorKey.split('.');

				return keys.reduce((acc, key) => acc[key], row);
			}),
		),
	);
	const constructDoc = useCallback(() => {
		const margin = 45;
		const doc = new JsPdf('p', 'px', 'a4');
		const logo = new Image();
		const footer = new Image();

		logo.src = '/danon-logo.png';
		footer.src = '/danon-footer.jpg';

		if (text) {
			doc.setFont('Heebo-normal', 'normal');
			doc.text(text, doc.internal.pageSize.width / 2, 35, {
				align: 'center',
			});
		}

		doc.addImage(logo, 'PNG', 26, 5, 70, 70 / 2);
		doc.addImage(
			footer,
			'JPG',
			doc.internal.pageSize.width / 2 - 142,
			doc.internal.pageSize.height - 33,
			doc.internal.pageSize.width / 2 + 50,
			25,
		);

		bodies.forEach((body) => {
			autoTable(doc, {
				startY: doc.lastAutoTable.finalY
					? doc.lastAutoTable.finalY + margin
					: margin,
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
		});

		return doc;
	}, [bodies, head, text]);
	const handleBase64 = useCallback(() => {
		const doc = constructDoc();
		const blob = doc.output('blob');
		const reader = new FileReader();
		reader.readAsDataURL(blob);
		const onLoadEnd = () => {
			setBase64(reader.result);
		};

		reader.addEventListener('loadend', onLoadEnd);

		return {
			onLoadEnd,
			reader,
		};
	}, [constructDoc]);

	useDeepCompareEffect(() => {
		const { onLoadEnd, reader } = handleBase64();

		return () => {
			reader.removeEventListener('loadend', onLoadEnd);
		};
	}, [bodies, head, text]);

	return base64;
};

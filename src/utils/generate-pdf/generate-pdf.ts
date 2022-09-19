import jsPDF from 'jspdf';

export const generatePdf = (html) => {
	const doc = new jsPDF();

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	return doc.html(html, {
		callback(doc) {
			return doc.output('dataurlstring');
		},
	});
};

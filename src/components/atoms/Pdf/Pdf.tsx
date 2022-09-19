import { useEffect, useState } from 'react';
import { generatePdf } from '../../../utils/generate-pdf/generate-pdf';

export const Pdf = ({ title, html, ...props }) => {
	const [src, setSrc] = useState('');

	useEffect(() => {
		if (!html) return;

		(async () => {
			const result = await generatePdf(html);

			setSrc(result);
		})();
	}, [html]);

	return (
		<iframe
			src={src}
			height={`100%`}
			width={`100%`}
			allowFullScreen
			className={`rounded`}
			title={title}
			{...props}
		/>
	);
};

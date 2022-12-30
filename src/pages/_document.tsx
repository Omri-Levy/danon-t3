import { Head, Html, Main, NextScript } from 'next/document';

const Document = () => {
	return (
		<Html data-theme={`bumblebee`} className={`scroll`}>
			<Head />
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
};

export default Document;

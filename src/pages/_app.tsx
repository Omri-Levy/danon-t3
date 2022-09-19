import '../styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import type { AppType } from 'next/dist/shared/lib/utils';
import { trpc } from '../utils/trpc';
import { AuthLayout } from '../components/templates/AuthLayout/AuthLayout';
import { Font } from '@react-pdf/renderer';

Font.register({
	family: 'Heebo',
	fonts: [
		{
			src: '/Heebo-Regular.ttf',
			fontWeight: 'normal',
		},
		{
			src: '/Heebo-Bold.ttf',
			fontWeight: 'bold',
		},
	],
});

const MyApp: AppType = ({ Component, pageProps }) => {
	return (
		<SessionProvider session={pageProps.session}>
			<AuthLayout>
				<Component {...pageProps} />
			</AuthLayout>
		</SessionProvider>
	);
};

export default trpc.withTRPC(MyApp);

import '../styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import type { AppType } from 'next/dist/shared/lib/utils';
import { trpc } from '../utils/trpc';
import { AuthLayout } from '../components/templates/AuthLayout/AuthLayout';
import { Font } from '@react-pdf/renderer';
import { Toaster } from 'react-hot-toast';

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
				<Toaster
					position='top-center'
					toastOptions={{
						duration: 3000,
					}}
				/>
				<Component {...pageProps} />
			</AuthLayout>
		</SessionProvider>
	);
};

export default trpc.withTRPC(MyApp);

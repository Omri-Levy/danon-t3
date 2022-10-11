import '../common/styles/globals.css';
import type { AppType } from 'next/dist/shared/lib/utils';
import { Toaster } from 'react-hot-toast';
import Head from 'next/head';
import { Spinner } from '../common/components/atoms/Spinner/Spinner';
import { Providers } from '../common/components/templates/Providers/Providers';

const MyApp: AppType = ({ Component, pageProps }) => {
	return (
		<Providers session={pageProps.session}>
			<Head>
				<title>Danon Ordering System</title>
				<meta
					name='description'
					content='Generated by create-t3-app'
				/>
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<Toaster
				position='top-center'
				containerStyle={{
					direction: 'rtl',
				}}
				toastOptions={{
					// In milliseconds - 1000 * 5 -> 5 seconds
					duration: 1000 * 10,
				}}
			/>
			<main className='flex flex-col items-center p-1 pt-[3vh] min-h-screen relative'>
				<Spinner />
				<Component {...pageProps} />
			</main>
		</Providers>
	);
};

export default MyApp;

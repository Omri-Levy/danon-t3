import '../styles/globals.css';
import type { AppType } from 'next/dist/shared/lib/utils';
import { Toaster } from 'react-hot-toast';
import Head from 'next/head';
import { Spinner } from '../components/atoms/Spinner/Spinner';
import { Providers } from '../components/templates/Providers/Providers';

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
				toastOptions={{
					duration: 3000,
				}}
			/>
			<main className='container pt-[7vh] min-h-screen p-2 mx-auto relative'>
				<Spinner />
				<Component {...pageProps} />
			</main>
		</Providers>
	);
};

export default MyApp;

import dynamic from 'next/dynamic';

const DynamicSignIn = dynamic(
	() => import('../../components/pages/SignIn/SignIn'),
	{
		ssr: false,
	},
);

export default DynamicSignIn;

// This file is required for next-auth

import dynamic from 'next/dynamic';
import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';

const DynamicSignIn = dynamic(
	async () => {
		const { SignIn } = await import(
			'../../auth/components/pages/SignIn/SignIn'
		);

		return SignIn;
	},
	{
		ssr: false,
	},
);
const SignIn: NextPage = () => <DynamicSignIn />;

export default SignIn;

export const getServerSideProps: GetServerSideProps = async (
	context,
) => {
	const session = await getSession(context);

	if (session) {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		};
	}

	return {
		props: { session },
	};
};

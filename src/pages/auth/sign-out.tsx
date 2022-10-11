// This file is required for next-auth

import dynamic from 'next/dynamic';
import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';

const DynamicSignOut = dynamic(
	async () => {
		const { SignOut } = await import(
			'../../auth/components/pages/SignOut/SignOut'
		);

		return SignOut;
	},
	{
		ssr: false,
	},
);
const SignOut: NextPage = () => <DynamicSignOut />;

export default SignOut;

export const getServerSideProps: GetServerSideProps = async (
	context,
) => {
	const session = await getSession(context);

	if (!session) {
		return {
			redirect: {
				destination: '/auth/sign-in',
				permanent: false,
			},
		};
	}

	return {
		props: { session },
	};
};

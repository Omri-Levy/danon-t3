// This file is required for next-auth

import dynamic from 'next/dynamic';
import { NextPage } from 'next';

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

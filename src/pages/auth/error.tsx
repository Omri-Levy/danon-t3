// This file is required for next-auth

import dynamic from 'next/dynamic';
import { NextPage } from 'next';

const DynamicError = dynamic(
	async () => {
		const { Error } = await import(
			'../../auth/components/pages/Error/Error'
		);

		return Error;
	},
	{
		ssr: false,
	},
);
const Error: NextPage = () => <DynamicError />;

export default Error;

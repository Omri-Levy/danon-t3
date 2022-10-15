import { NextPage } from 'next';
import { useEffect } from 'react';
import { signOut } from 'next-auth/react';

export const SignOut: NextPage = () => {
	useEffect(() => {
		signOut();
	}, []);

	return null;
};

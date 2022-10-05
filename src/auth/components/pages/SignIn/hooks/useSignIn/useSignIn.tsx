import { signIn, useSession } from 'next-auth/react';
import { FormEventHandler, useCallback } from 'react';

export const useSignIn = () => {
	const { status } = useSession();
	const isLoading = status === 'loading';
	const onSignIn: FormEventHandler = useCallback(
		async (e) => {
			e.preventDefault();

			return signIn('azure-ad');
		},
		[signIn],
	);

	return {
		isLoading,
		onSignIn,
	};
};

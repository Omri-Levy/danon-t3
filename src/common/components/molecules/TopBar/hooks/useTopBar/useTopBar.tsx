import { signOut, useSession } from 'next-auth/react';
import { useCallback } from 'react';

export const useTopBar = () => {
	const { status } = useSession();
	const isLoadingSession = status === 'loading';
	// Otherwise the input onChange event will be passed into signOut.
	const onSignOut = useCallback(() => signOut(), []);

	return {
		isLoadingSession,
		onSignOut,
	};
};

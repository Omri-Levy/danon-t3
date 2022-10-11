import { useSession } from 'next-auth/react';

export const useTopBar = () => {
	const { status } = useSession();
	const isLoadingSession = status === 'loading';

	return {
		isLoadingSession,
	};
};

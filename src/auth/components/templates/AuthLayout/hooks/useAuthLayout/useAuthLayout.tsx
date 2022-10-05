import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useCallback } from 'react';

export const useAuthLayout = () => {
	const { data: session, status } = useSession();
	const { pathname, replace } = useRouter();
	const isLoading = status === `loading`;
	const navigateToPath = useCallback(() => {
		if (isLoading) return true;

		const isSignInPage = pathname === '/auth/sign-in';
		let path: string | undefined;

		if (session && isSignInPage) {
			path = `/`;
		}

		if (!session && !isSignInPage) {
			path = `/auth/sign-in`;
		}

		if (!path) return;

		replace(path);

		// Render children when not redirecting and not loading
		return !!path;
	}, [replace, session, isLoading]);

	return navigateToPath;
};

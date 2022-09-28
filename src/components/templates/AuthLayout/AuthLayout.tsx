import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { ComponentWithChildren } from '../../../types';

export const AuthLayout: ComponentWithChildren = ({ children }) => {
	const { data: session, status } = useSession();
	const { replace, pathname } = useRouter();
	const navigateToSignIn = !session && pathname !== `/auth/sign-in`;
	const navigateToRoot = session && pathname === `/auth/sign-in`;
	const path = navigateToSignIn ? `/auth/sign-in` : `/`;

	if (typeof window === 'undefined' || status === `loading`) {
		return null;
	}

	if (navigateToRoot || navigateToSignIn) {
		replace(path);

		return null;
	}

	return <>{children}</>;
};

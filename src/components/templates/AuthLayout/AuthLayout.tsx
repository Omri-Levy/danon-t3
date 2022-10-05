import { useSession } from 'next-auth/react';
import { ComponentWithChildren } from '../../../types';
import { useRouter } from 'next/router';

export const AuthLayout: ComponentWithChildren = ({ children }) => {
	const { data: session, status } = useSession();
	const { pathname, replace } = useRouter();
	const navigateToSignIn = !session && pathname !== `/auth/sign-in`;
	const navigateToRoot = session && pathname === `/auth/sign-in`;
	const path = navigateToSignIn ? `/auth/sign-in` : `/`;

	if (status === `loading`) {
		return null;
	}

	if (navigateToRoot || navigateToSignIn) {
		replace(path);

		return null;
	}

	return <>{children}</>;
};

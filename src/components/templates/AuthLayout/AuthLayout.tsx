import { useSession } from 'next-auth/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ComponentWithChildren } from '../../../types';

export const AuthLayout: ComponentWithChildren = ({ children }) => {
	const { data: session, status } = useSession();
	const { pathname } = useLocation();
	const navigateToSignIn = !session && pathname !== `/auth/sign-in`;
	const navigateToRoot = session && pathname === `/auth/sign-in`;
	const path = navigateToSignIn ? `/auth/sign-in` : `/`;
	const navigate = useNavigate();

	if (status === `loading`) {
		return null;
	}

	if (navigateToRoot || navigateToSignIn) {
		navigate(path, { replace: true });

		return null;
	}

	return <>{children}</>;
};

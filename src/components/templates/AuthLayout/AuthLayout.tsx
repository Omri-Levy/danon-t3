import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { ComponentWithChildren } from '../../../types';

export const AuthLayout: ComponentWithChildren = ({ children }) => {
	const { data: session, status } = useSession();
	const { replace } = useRouter();

	if (typeof window === 'undefined' || status === `loading`) {
		return null;
	}

	if (!session) {
		replace('/api/auth/signin');

		return null;
	}

	return <>{children}</>;
};

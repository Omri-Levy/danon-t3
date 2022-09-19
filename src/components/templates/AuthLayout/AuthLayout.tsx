import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { FunctionComponent } from 'react';

export const AuthLayout: FunctionComponent<{
	children: any;
}> = ({ children }) => {
	const { data: session, status } = useSession();
	const { replace } = useRouter();

	if (typeof window === 'undefined' || status === `loading`) {
		return null;
	}

	return session ? children : replace('/api/auth/signin');
};

import { TComponentWithChildren } from '../../../../common/types';
import { useAuthLayout } from './hooks/useAuthLayout/useAuthLayout';

export const AuthLayout: TComponentWithChildren = ({ children }) => {
	const navigateToPath = useAuthLayout();
	const renderNull = navigateToPath();

	if (renderNull) return null;

	return <>{children}</>;
};

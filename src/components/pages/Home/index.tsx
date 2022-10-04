import { lazy } from 'react';
import { loader } from './loader';

const LazyHome = lazy(() => import('../../pages/Home/Home'));
export const Home = {
	path: '/',
	element: <LazyHome />,
	loader,
};

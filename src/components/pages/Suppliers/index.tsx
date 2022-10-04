import { lazy } from 'react';
import { loader } from './loader';

const LazySuppliers = lazy(
	() => import('../../pages/Suppliers/Suppliers'),
);
export const Suppliers = {
	path: '/suppliers',
	element: <LazySuppliers />,
	loader,
};

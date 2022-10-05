import { useCreateSupplier } from '../../../../suppliers.api';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createSupplierSchema } from '../../../../validation';
import { useCallback, useEffect } from 'react';

export const useCreateSupplierModal = () => {
	const { onCreate, isLoading, isSuccess } = useCreateSupplier();
	const createSupplierMethods = useForm({
		mode: 'all',
		criteriaMode: 'all',
		resolver: zodResolver(createSupplierSchema),
		defaultValues: {
			email: '',
			name: '',
		},
	});
	const handleReset = useCallback(() => {
		if (!isSuccess) return;

		createSupplierMethods?.reset();
	}, [isSuccess, createSupplierMethods?.reset]);
	const handleFocus = useCallback(() => {
		if (!isSuccess || createSupplierMethods?.formState?.isDirty)
			return;

		createSupplierMethods?.setFocus('name');
	}, [
		isSuccess,
		createSupplierMethods?.setFocus,
		createSupplierMethods?.formState?.isDirty,
	]);

	useEffect(() => {
		handleReset();
	}, [handleReset]);

	useEffect(() => {
		handleFocus();
	}, [handleFocus]);

	return {
		createSupplierMethods,
		onCreate,
		isLoading,
	};
};

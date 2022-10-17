import { useCreateSupplier } from '../../../../suppliers.api';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createSupplierSchema } from '../../../../validation';
import { useCallback } from 'react';
import { ICreateSupplierFormFields } from './interfaces';

export const useCreateSupplierModal = () => {
	const { onCreate, isLoading } = useCreateSupplier();
	const createSupplierMethods = useForm<ICreateSupplierFormFields>({
		mode: 'all',
		criteriaMode: 'all',
		resolver: zodResolver(createSupplierSchema),
		defaultValues: {
			email: '',
			name: '',
		},
	});
	const handleFocus = useCallback(
		() => createSupplierMethods?.setFocus('name'),
		[createSupplierMethods?.setFocus],
	);
	const handleSubmit: SubmitHandler<ICreateSupplierFormFields> =
		useCallback(
			onCreate(createSupplierMethods?.reset, handleFocus),
			[createSupplierMethods?.reset, handleFocus, onCreate],
		);

	return {
		createSupplierMethods,
		handleSubmit,
		isLoading,
	};
};

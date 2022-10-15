import { useCreateSupplier } from '../../../../suppliers.api';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createSupplierSchema } from '../../../../validation';
import { FormEventHandler, useCallback } from 'react';

export const useCreateSupplierModal = () => {
	const { onCreate, isLoading } = useCreateSupplier();
	const createSupplierMethods = useForm({
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
	const handleSubmit: FormEventHandler<HTMLFormElement> =
		useCallback(
			(e) => {
				createSupplierMethods.handleSubmit(
					onCreate(
						createSupplierMethods?.reset,
						handleFocus,
					),
				)(e);
			},
			[
				createSupplierMethods.handleSubmit,
				createSupplierMethods?.reset,
				handleFocus,
				onCreate,
			],
		);

	return {
		createSupplierMethods,
		handleSubmit,
		isLoading,
	};
};

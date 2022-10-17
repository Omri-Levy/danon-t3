import { useCreateSupplier } from '../../../../suppliers.api';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createSupplierSchema } from '../../../../validation';
import { useCallback } from 'react';

export interface ICreateSupplierFormFields {
	email: string;
	name: string;
}

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

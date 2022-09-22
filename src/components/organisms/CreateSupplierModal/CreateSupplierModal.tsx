import { locale } from '../../../translations';
import {
	FormProvider,
	SubmitHandler,
	useForm,
} from 'react-hook-form';
import { FormInput } from '../../molecules/FormInput/FormInput';
import { zodResolver } from '@hookform/resolvers/zod';
import { createSuppliersApi } from '../../../api/suppliers-api';
import { InferMutationInput } from '../../../types';
import * as Dialog from '@radix-ui/react-dialog';
import clsx from 'clsx';
import { createSupplierSchema } from '../../../server/suppliers/validation';
import { useCallback, useEffect } from 'react';

export const CreateSupplierModal = ({ isOpen, onOpen }) => {
	const suppliersApi = createSuppliersApi();
	const { onCreate, isLoading, isSuccess } = suppliersApi.create();
	const onCreateSupplierSubmit: SubmitHandler<
		InferMutationInput<'suppliers.create'>
	> = async (data) => onCreate(data);
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

	return (
		<Dialog.Root open={isOpen} onOpenChange={onOpen}>
			<Dialog.Trigger className={`btn`}>
				{locale.he.createSupplier}
			</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay>
					<div
						className={clsx([
							`modal`,
							{
								[`modal-open`]: isOpen,
							},
						])}
					>
						<Dialog.Content className={`modal-box`}>
							<div className={`flex justify-end`}>
								<Dialog.Close>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										viewBox='0 0 24 24'
										fill='currentColor'
										className='w-6 h-6'
									>
										<path
											fillRule='evenodd'
											d='M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z'
											clipRule='evenodd'
										/>
									</svg>
								</Dialog.Close>
							</div>
							<Dialog.Title
								dir={`rtl`}
								className={`font-bold text-center`}
							>
								{locale.he.createSupplier}
							</Dialog.Title>
							<FormProvider {...createSupplierMethods}>
								<form
									noValidate
									className='grid grid-cols-2 gap-x-2'
									dir={`rtl`}
									onSubmit={createSupplierMethods.handleSubmit(
										onCreateSupplierSubmit,
										(errors) =>
											console.error(errors),
									)}
								>
									<FormInput
										label={locale.he.name}
										name='name'
										autoFocus
									/>
									<FormInput
										label={locale.he.email}
										name='email'
									/>
									<div
										className={`modal-action col-span-full `}
									>
										<button
											className={clsx([
												`btn mr-auto`,
												{
													loading:
														isLoading,
												},
											])}
											disabled={isLoading}
											type={`submit`}
										>
											{locale.he.create}
										</button>
									</div>
								</form>
							</FormProvider>
						</Dialog.Content>
					</div>
				</Dialog.Overlay>
			</Dialog.Portal>
		</Dialog.Root>
	);
};

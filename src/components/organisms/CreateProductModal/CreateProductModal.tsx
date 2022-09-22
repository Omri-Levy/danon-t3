import { locale } from '../../../translations';
import {
	FormProvider,
	SubmitHandler,
	useForm,
} from 'react-hook-form';
import { FormInput } from '../../molecules/FormInput/FormInput';
import { FormSelect } from '../../molecules/FormSelect/FormSelect';
import { Unit } from '@prisma/client';
import { useCallback, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { createProductsApi } from '../../../api/products-api';
import { InferMutationInput } from '../../../types';
import { createProductSchema } from '../../../server/products/validation';
import { createSuppliersApi } from '../../../api/suppliers-api';
import * as Dialog from '@radix-ui/react-dialog';
import clsx from 'clsx';

export const CreateProductModal = ({ isOpen, onOpen }) => {
	const productsApi = createProductsApi();
	const suppliersApi = createSuppliersApi();
	const { supplierNames } = suppliersApi.getAllSupplierNames();
	const createProductMethods = useForm({
		mode: 'all',
		criteriaMode: 'all',
		resolver: zodResolver(createProductSchema),
		defaultValues: {
			supplier: '',
			sku: '',
			name: '',
			packageSize: 1,
			unit: Unit.KG,
			orderAmount: 0,
			stock: 0,
		},
	});
	const { onCreate, isLoading, isSuccess } = productsApi.create();
	const onCreateProductSubmit: SubmitHandler<
		InferMutationInput<'products.create'>
	> = async (data) => onCreate(data);
	const handleReset = useCallback(() => {
		if (!isSuccess) return;

		createProductMethods?.reset();
	}, [isSuccess, createProductMethods?.reset]);
	const handleFocus = useCallback(() => {
		if (!isSuccess || createProductMethods?.formState?.isDirty)
			return;

		createProductMethods?.setFocus('sku');
	}, [
		isSuccess,
		createProductMethods?.setFocus,
		createProductMethods?.formState?.isDirty,
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
				{locale.he.createProduct}
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
								{locale.he.createProduct}
							</Dialog.Title>
							<FormProvider {...createProductMethods}>
								<form
									noValidate
									className='grid grid-cols-2 gap-x-2'
									dir={`rtl`}
									onSubmit={createProductMethods.handleSubmit(
										onCreateProductSubmit,
										(errors) =>
											console.error(errors),
									)}
								>
									<FormSelect
										options={supplierNames ?? []}
										label={locale.he.supplier}
										name='supplier'
									/>
									<FormInput
										label={locale.he.sku}
										name='sku'
										autoFocus
									/>
									<FormInput
										label={locale.he.productName}
										name='name'
									/>
									<FormInput
										label={locale.he.packageSize}
										name='packageSize'
										type={`number`}
										min={0.1}
									/>
									<FormSelect
										label={locale.he.unit}
										name='unit'
										options={Object.values(Unit)}
									/>
									<FormInput
										label={locale.he.orderAmount}
										name='orderAmount'
										type={`number`}
										min={0}
									/>
									<FormInput
										label={locale.he.stock}
										name='stock'
										type={`number`}
										min={0}
									/>
									<button
										className={clsx([
											'btn mt-2 mr-auto col-span-full',
											{ loading: isLoading },
										])}
										disabled={isLoading}
										type={`submit`}
									>
										{locale.he.create}
									</button>
								</form>
							</FormProvider>
						</Dialog.Content>
					</div>
				</Dialog.Overlay>
			</Dialog.Portal>
		</Dialog.Root>
	);
};

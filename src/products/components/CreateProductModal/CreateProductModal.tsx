import { locale } from '../../../common/translations';
import { FormProvider, useForm } from 'react-hook-form';
import { FormInput } from '../../../common/components/molecules/Form/FormInput/FormInput';
import { FormSelect } from '../../../common/components/molecules/Form/FormSelect/FormSelect';
import { Unit } from '../../../common/enums';
import { FunctionComponent, useCallback, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { createProductSchema } from '../../validation';
import * as Dialog from '@radix-ui/react-dialog';
import clsx from 'clsx';
import { useCreateProduct } from '../../products.api';
import { useGetAllSupplierNames } from '../../../suppliers/suppliers.api';
import { ICreateProductModalProps } from './interfaces';
import { zSupplierNamesEnum } from '../../../suppliers/utils/z-supplier-names-enum/z-supplier-names-enum';

export const CreateProductModal: FunctionComponent<
	ICreateProductModalProps
> = ({ isOpen, onOpen }) => {
	const { supplierNames } = useGetAllSupplierNames();
	const createProductMethods = useForm({
		mode: 'all',
		criteriaMode: 'all',
		resolver: zodResolver(
			createProductSchema.setKey(
				'supplier',
				zSupplierNamesEnum(supplierNames ?? []),
			),
		),
		defaultValues: {
			supplier: supplierNames?.at(0) ?? '',
			sku: '',
			name: '',
			packageSize: 1,
			unit: Unit.KG,
			orderAmount: 0,
			stock: 0,
		},
	});
	const { onCreate, isLoading, isSuccess } = useCreateProduct();
	const handleReset = useCallback(() => {
		if (!isSuccess) return;

		createProductMethods?.reset();
	}, [isSuccess, createProductMethods?.reset]);
	const handleFocus = useCallback(() => {
		if (!isSuccess || createProductMethods?.formState?.isDirty)
			return;

		createProductMethods?.setFocus('supplier');
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
										onCreate,
									)}
								>
									<FormSelect
										options={supplierNames ?? []}
										label={locale.he.supplier}
										name='supplier'
										autoFocus
									/>
									<FormInput
										label={locale.he.sku}
										name='sku'
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
										dir={`ltr`}
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

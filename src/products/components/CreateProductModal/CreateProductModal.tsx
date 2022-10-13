import { locale } from '../../../common/translations';
import { FormProvider, useForm } from 'react-hook-form';
import { FormInput } from '../../../common/components/molecules/Form/FormInput/FormInput';
import { FormSelect } from '../../../common/components/molecules/Form/FormSelect/FormSelect';
import { Unit } from '../../../common/enums';
import { FunctionComponent, useCallback, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { createProductSchema } from '../../validation';
import clsx from 'clsx';
import { useCreateProduct } from '../../products.api';
import { useGetAllSupplierNames } from '../../../suppliers/suppliers.api';
import { ICreateProductModalProps } from './interfaces';
import { zSupplierNamesEnum } from '../../../suppliers/utils/z-supplier-names-enum/z-supplier-names-enum';
import { Modal } from '../../../common/components/molecules/Modal/Modal';

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
		<Modal
			isOpen={isOpen}
			onOpen={onOpen}
			title={locale.he.createProduct}
		>
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
					<FormInput label={locale.he.sku} name='sku' />
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
		</Modal>
	);
};

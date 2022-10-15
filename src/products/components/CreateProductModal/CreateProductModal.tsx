import { locale } from '../../../common/translations';
import { FormProvider, useForm } from 'react-hook-form';
import { FormInput } from '../../../common/components/molecules/Form/FormInput/FormInput';
import { FormSelect } from '../../../common/components/molecules/Form/FormSelect/FormSelect';
import { Unit } from '../../../common/enums';
import {
	FormEventHandler,
	FunctionComponent,
	useCallback,
} from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { createProductSchema } from '../../validation';
import clsx from 'clsx';
import { useCreateProduct } from '../../products.api';
import { useGetAllSupplierNames } from '../../../suppliers/suppliers.api';
import { zSupplierNamesEnum } from '../../../suppliers/utils/z-supplier-names-enum/z-supplier-names-enum';
import { Modal } from '../../../common/components/molecules/Modal/Modal';
import { useModalsStore } from '../../../common/stores/modals/modals';

export const CreateProductModal: FunctionComponent = () => {
	const { isOpen, onToggleIsCreatingProduct } = useModalsStore(
		(state) => ({
			isOpen: state.isOpen,
			onToggleIsCreatingProduct:
				state.onToggleIsCreatingProduct,
		}),
	);
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
	const { onCreate, isLoading } = useCreateProduct();
	const handleFocus = useCallback(
		() => createProductMethods?.setFocus('supplier'),
		[
			createProductMethods?.setFocus,
			createProductMethods?.formState?.isDirty,
		],
	);
	const handleSubmit: FormEventHandler<HTMLFormElement> =
		useCallback(
			(e) => {
				createProductMethods.handleSubmit(
					onCreate(
						createProductMethods?.reset,
						handleFocus,
					),
				)(e);
			},
			[
				createProductMethods.handleSubmit,
				createProductMethods.reset,
				handleFocus,
				onCreate,
			],
		);

	return (
		<Modal
			isOpen={isOpen}
			onOpen={onToggleIsCreatingProduct}
			title={locale.he.createProduct}
		>
			<FormProvider {...createProductMethods}>
				<form
					noValidate
					className='grid grid-cols-2 gap-x-2'
					dir={`rtl`}
					onSubmit={handleSubmit}
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
							'btn mt-2 mr-auto col-span-full gap-2',
							{ loading: isLoading },
						])}
						disabled={isLoading}
						type={`submit`}
					>
						{locale.he.create}
						<svg
							xmlns='http://www.w3.org/2000/svg'
							viewBox='0 0 20 20'
							fill='currentColor'
							className='w-5 h-5'
						>
							<path d='M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z' />
						</svg>
					</button>
				</form>
			</FormProvider>
		</Modal>
	);
};

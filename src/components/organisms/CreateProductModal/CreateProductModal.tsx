import { Modal } from '../../molecules/Modal/Modal';
import { locale } from '../../../translations';
import {
	FormProvider,
	SubmitHandler,
	useForm,
} from 'react-hook-form';
import { FormInput } from '../../molecules/FormInput/FormInput';
import { FormSelect } from '../../molecules/FormSelect/FormSelect';
import { Product, Unit } from '@prisma/client';
import { useRef } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProductModel, SupplierModel } from '../../../../prisma/zod';
import { trpc } from '../../../utils/trpc';

export const CreateProductModal = ({ isOpen, onClose }) => {
	const createProductMethods = useForm({
		mode: 'all',
		criteriaMode: 'all',
		resolver: zodResolver(
			ProductModel.pick({
				sku: true,
				name: true,
				unit: true,
				packageSize: true,
				orderAmount: true,
				stock: true,
			}).setKey('supplier', SupplierModel.shape.name),
		),
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
	const trpcUtils = trpc.useContext();
	const { mutateAsync: createProductAsyncMutation } =
		trpc.proxy.products.createProduct.useMutation({
			onSettled: () => {
				trpcUtils.invalidateQueries('products.getProducts');
			},
		});
	const skuInputRef = useRef<HTMLInputElement>(null);
	const onCreateProductSubmit: SubmitHandler<
		Pick<
			Product,
			| 'sku'
			| 'name'
			| 'packageSize'
			| 'unit'
			| 'orderAmount'
			| 'stock'
		> & { supplier: string }
	> = async (data) => {
		await createProductAsyncMutation(data);
		skuInputRef.current?.focus();
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<h2 className={'text-3xl font-bold mb-2 text-center'}>
				{locale.he.createProduct}
			</h2>
			<FormProvider {...createProductMethods}>
				<form
					noValidate
					className='grid grid-cols-2 gap-x-2'
					dir={`rtl`}
					onSubmit={createProductMethods.handleSubmit(
						onCreateProductSubmit,
						(errors) => console.error(errors),
					)}
				>
					<FormInput
						label={locale.he.supplier}
						name='supplier'
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
						className={'btn mt-2 mr-auto col-span-full'}
						type={`submit`}
					>
						{locale.he.create}
					</button>
				</form>
			</FormProvider>
		</Modal>
	);
};

import { locale } from '../../../common/translations';
import { Unit } from '../../../common/enums';
import { FunctionComponent } from 'react';
import clsx from 'clsx';
import { Modal } from '../../../common/components/molecules/Modal/Modal';
import { useCreateProductModal } from './hooks/useCreateProductModal/useCreateProductModal';

export const CreateProductModal: FunctionComponent = () => {
	const {
		isOpen,
		onToggleIsCreatingProduct,
		createProductMethods,
		handleSubmit,
		supplierNames,
		isLoading,
		Form,
	} = useCreateProductModal();

	return (
		<Modal
			isOpen={isOpen}
			onOpen={onToggleIsCreatingProduct}
			title={locale.he.createProduct}
		>
			<Form
				methods={createProductMethods}
				onSubmit={handleSubmit}
				dir={`rtl`}
				className='grid grid-cols-2 gap-x-2'
			>
				<Form.Select
					options={supplierNames ?? []}
					label={locale.he.supplier}
					name='supplier'
					autoFocus
				/>
				<Form.Input label={locale.he.sku} name='sku' />
				<Form.Input
					label={locale.he.productName}
					name='name'
				/>
				<Form.Input
					label={locale.he.packageSize}
					name='packageSize'
					type={`number`}
					min={0.1}
				/>
				<Form.Select
					label={locale.he.unit}
					name='unit'
					options={Object.values(Unit)}
				/>
				<Form.Input
					label={locale.he.orderAmount}
					name='orderAmount'
					type={`number`}
					min={0}
				/>
				<Form.Input
					label={locale.he.stock}
					name='stock'
					type={`number`}
					min={0}
				/>
				<Form.SubmitButton
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
				</Form.SubmitButton>
			</Form>
		</Modal>
	);
};

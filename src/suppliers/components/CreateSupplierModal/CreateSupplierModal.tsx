import { locale } from '../../../common/translations';
import clsx from 'clsx';
import {
	ICreateSupplierFormFields,
	useCreateSupplierModal,
} from './hooks/useCreateSupplierModal/useCreateSupplierModal';
import { Modal } from '../../../common/components/molecules/Modal/Modal';
import { useModalsStore } from '../../../common/stores/modals/modals';
import { FunctionComponent } from 'react';
import { getForm } from '../../../common/components/molecules/Form/get-form';

export const CreateSupplierModal: FunctionComponent = () => {
	const { createSupplierMethods, isLoading, handleSubmit } =
		useCreateSupplierModal();
	const { isOpen, onToggleIsCreatingSupplier } = useModalsStore(
		(state) => ({
			isOpen: state.isOpen,
			onToggleIsCreatingSupplier:
				state.onToggleIsCreatingSupplier,
		}),
	);
	const Form = getForm<ICreateSupplierFormFields>();

	return (
		<Modal
			title={locale.he.createSupplier}
			isOpen={isOpen}
			onOpen={onToggleIsCreatingSupplier}
		>
			<Form
				methods={createSupplierMethods}
				onSubmit={handleSubmit}
				className='grid grid-cols-1 gap-x-2'
				dir={`rtl`}
			>
				<Form.Input
					label={locale.he.name}
					name='name'
					className={`input input-bordered max-w-sm`}
					autoFocus
				/>
				<Form.Input
					label={locale.he.email}
					name='email'
					className={`input input-bordered max-w-sm`}
				/>
				<div className={`modal-action col-span-full `}>
					<Form.SubmitButton
						dir={`ltr`}
						className={clsx([
							'btn mt-2 mr-auto col-span-full gap-2',
							{
								loading: isLoading,
							},
						])}
						disabled={isLoading}
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
				</div>
			</Form>
		</Modal>
	);
};

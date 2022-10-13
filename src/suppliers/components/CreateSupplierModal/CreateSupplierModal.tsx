import { locale } from '../../../common/translations';
import { FormProvider } from 'react-hook-form';
import { FormInput } from '../../../common/components/molecules/Form/FormInput/FormInput';
import clsx from 'clsx';
import { useCreateSupplierModal } from './hooks/useCreateSupplierModal/useCreateSupplierModal';
import { Modal } from '../../../common/components/molecules/Modal/Modal';
import { useModalsStore } from '../../../common/stores/modals/modals';
import { FunctionComponent } from 'react';

export const CreateSupplierModal: FunctionComponent = () => {
	const { createSupplierMethods, isLoading, onCreate } =
		useCreateSupplierModal();
	const { isOpen, onToggleIsCreatingSupplier } = useModalsStore();

	return (
		<Modal
			title={locale.he.createSupplier}
			isOpen={isOpen}
			onOpen={onToggleIsCreatingSupplier}
		>
			<FormProvider {...createSupplierMethods}>
				<form
					noValidate
					className='grid grid-cols-1 gap-x-2'
					dir={`rtl`}
					onSubmit={createSupplierMethods.handleSubmit(
						onCreate,
					)}
				>
					<FormInput
						label={locale.he.name}
						name='name'
						className={`input input-bordered max-w-sm`}
						autoFocus
					/>
					<FormInput
						label={locale.he.email}
						name='email'
						className={`input input-bordered max-w-sm`}
					/>
					<div className={`modal-action col-span-full `}>
						<button
							dir={`ltr`}
							className={clsx([
								'btn mt-2 mr-auto col-span-full',
								{
									loading: isLoading,
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
		</Modal>
	);
};

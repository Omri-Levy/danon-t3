import { locale } from '../../../common/translations';
import { FormProvider } from 'react-hook-form';
import { FormInput } from '../../../common/components/molecules/Form/FormInput/FormInput';
import * as Dialog from '@radix-ui/react-dialog';
import clsx from 'clsx';
import { ICreateSupplierModalProps } from './interfaces';
import { useCreateSupplierModal } from './hooks/useCreateSupplierModal/useCreateSupplierModal';

export const CreateSupplierModal = ({
	isOpen,
	onOpen,
}: ICreateSupplierModalProps) => {
	const { createSupplierMethods, isLoading, onCreate } =
		useCreateSupplierModal();

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
									<div
										className={`modal-action col-span-full `}
									>
										<button
											dir={`ltr`}
											className={clsx([
												'btn mt-2 mr-auto col-span-full',
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

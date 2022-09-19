import { Modal } from '../../molecules/Modal/Modal';
import { locale } from '../../../translations';
import {
	FormProvider,
	SubmitHandler,
	useForm,
} from 'react-hook-form';
import { FormInput } from '../../molecules/FormInput/FormInput';
import { zodResolver } from '@hookform/resolvers/zod';
import { SupplierModel } from '../../../../prisma/zod';
import { Supplier } from '@prisma/client';
import { trpc } from '../../../utils/trpc';

export const CreateSupplierModal = ({ isOpen, onClose }) => {
	const { mutateAsync: createSupplierAsyncMutation } =
		trpc.proxy.suppliers.createSupplier.useMutation();
	const onCreateSupplierSubmit: SubmitHandler<
		Pick<Supplier, 'name' | 'email'>
	> = async (data) => {
		await createSupplierAsyncMutation(data);
	};
	const createSupplierMethods = useForm({
		mode: 'all',
		criteriaMode: 'all',
		resolver: zodResolver(
			SupplierModel.pick({
				email: true,
				name: true,
			}),
		),
		defaultValues: {
			email: '',
			name: '',
		},
	});

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<h2 className={'text-3xl font-bold mb-2 text-center'}>
				{locale.he.createSupplier}
			</h2>
			<FormProvider {...createSupplierMethods}>
				<form
					noValidate
					className='grid grid-cols-2 gap-x-2'
					dir={`rtl`}
					onSubmit={createSupplierMethods.handleSubmit(
						onCreateSupplierSubmit,
						(errors) => console.error(errors),
					)}
				>
					<FormInput label={locale.he.name} name='name' />
					<FormInput label={locale.he.email} name='email' />
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

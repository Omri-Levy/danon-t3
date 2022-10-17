import { useModalsStore } from '../../../../../common/stores/modals/modals';
import { useCreateProduct } from '../../../../products.api';
import { useGetAllSupplierNames } from '../../../../../suppliers/suppliers.api';
import { useForm } from 'react-hook-form';
import { ICreateProductFormFields } from '../../interfaces';
import { zodResolver } from '@hookform/resolvers/zod';
import { createProductSchema } from '../../../../validation';
import { zSupplierNamesEnum } from '../../../../../suppliers/utils/z-supplier-names-enum/z-supplier-names-enum';
import { Unit } from '../../../../../common/enums';
import { useCallback } from 'react';

export const useCreateProductModal = () => {
	const { isOpen, onToggleIsCreatingProduct } = useModalsStore(
		(state) => ({
			isOpen: state.isOpen,
			onToggleIsCreatingProduct:
				state.onToggleIsCreatingProduct,
		}),
	);
	const { onCreate, isLoading } = useCreateProduct();
	const { supplierNames } = useGetAllSupplierNames();
	const createProductMethods = useForm<ICreateProductFormFields>({
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
	const handleFocus = useCallback(
		() => createProductMethods?.setFocus('supplier'),
		[
			createProductMethods?.setFocus,
			createProductMethods?.formState?.isDirty,
		],
	);
	const handleSubmit = useCallback(
		onCreate(createProductMethods?.reset, handleFocus),
		[createProductMethods.reset, handleFocus, onCreate],
	);

	return {
		isOpen,
		onToggleIsCreatingProduct,
		createProductMethods,
		handleSubmit,
		supplierNames,
		isLoading,
	};
};

import {
	DefaultValues,
	FieldValues,
	KeepStateOptions,
	SubmitHandler,
} from 'react-hook-form';
import {
	TIdsSchema,
	TProductDeleteByIdsInput,
	TProductGetAllOutput,
	TProductUpdateByIdInput,
} from '../common/types';
import { trpc } from 'src/common/utils/trpc/trpc-clients';
import { ICreateProductFormFields } from './components/CreateProductModal/interfaces';
import { useSearchParams } from 'react-router-dom';
import { parseSearchParams } from './components/ProductsTable/hooks/useProductsTable./useProductsTable';
import { TImportCSVSchema } from './types';

export const useCreateProduct = () => {
	const ctx = trpc.useContext();
	const { mutateAsync, ...mutation } =
		trpc.products.create.useMutation({
			onMutate: async (newData) => {
				ctx.products.getAll.cancel();
				const previousData = ctx.products.getAll.getData();

				ctx.products.getAll.setData((prevData: any) => [
					...prevData,
					newData,
				]);

				return {
					previousData,
					resource: 'product',
					action: 'create',
				};
			},
			onError: (err, newData, context) => {
				if (!context?.previousData) return;

				ctx.products.getAll.setData(context.previousData);
			},
			onSettled: () => {
				ctx.products.getAll.invalidate();
			},
		});
	const onCreate: (
		reset: (
			values?: DefaultValues<FieldValues> | FieldValues,
			keepStateOptions?: KeepStateOptions,
		) => void,
		focus: () => void,
	) => SubmitHandler<ICreateProductFormFields> =
		(reset, focus) => async (data) => {
			try {
				return await mutateAsync(data, {
					onSuccess: () => {
						focus();
						reset();
					},
				});
			} catch {}
		};

	return {
		onCreate,
		...mutation,
	};
};

export const useUpdateProductById = () => {
	const ctx = trpc.useContext();
	const { mutateAsync, ...mutation } =
		trpc.products.updateById.useMutation({
			onMutate: async (updatedData) => {
				ctx.products.getAll.cancel();
				const previousData = ctx.products.getAll.getData();

				ctx.products.getAll.setData((prevData) =>
					prevData?.map((data: any) =>
						data.id === updatedData.id
							? {
									...data,
									...updatedData,
							  }
							: data,
					),
				);

				return {
					previousData,
					resource: 'product',
					action: 'update',
				};
			},
			onError: (err, newData, context) => {
				if (!context?.previousData) return;

				ctx.products.getAll.setData(context.previousData);
			},
			onSettled: () => {
				ctx.products.getAll.invalidate();
			},
		});
	const onUpdateById: SubmitHandler<
		TProductUpdateByIdInput
	> = async (data) => {
		try {
			return await mutateAsync(data);
		} catch {}
	};

	return {
		onUpdateById,
		...mutation,
	};
};

export const useDeleteProductsByIds = (
	onToggleIsDeletingSelectedProducts?: (
		nextState?: boolean,
	) => void,
) => {
	const ctx = trpc.useContext();
	const [searchParams, setSearchParams] = useSearchParams();
	const { selected } = parseSearchParams(searchParams);
	const { mutateAsync, ...mutation } =
		trpc.products.deleteByIds.useMutation({
			onMutate: async ({ ids }) => {
				ctx.products.getAll.cancel();
				const previousData = ctx.products.getAll.getData();
				const previousSelected = selected;
				ctx.products.getAll.setData((prevData) =>
					prevData?.filter(
						(data) => !ids.includes(data.id),
					),
				);
				searchParams.set('selected', '');
				setSearchParams(searchParams);

				return {
					previousData,
					previousSelected,
					resource: 'product',
					action: 'delete',
				};
			},
			onError: (err, newData, context) => {
				if (!context?.previousData) return;

				ctx.products.getAll.setData(context.previousData);
				searchParams.set(
					'selected',
					context.previousSelected ?? '',
				);
				setSearchParams(searchParams);
			},
			onSuccess: () => {
				onToggleIsDeletingSelectedProducts?.(false);
			},
			onSettled: () => {
				ctx.products.getAll.invalidate();
			},
		});
	const onDeleteByIds: SubmitHandler<
		TProductDeleteByIdsInput
	> = async (data) => {
		try {
			return await mutateAsync(data);
		} catch {}
	};

	return {
		onDeleteByIds,
		...mutation,
	};
};

export const useGetAllProducts = (
	initialData?: TProductGetAllOutput,
) => {
	const { data, ...query } = trpc.products.getAll.useQuery(
		undefined,
		{
			initialData,
		},
	);

	return {
		products: data,
		...query,
	};
};

export const useGetAllProductsBySupplierName = (
	supplier: string,
	initialData?: TProductGetAllOutput,
) => {
	const { data, ...query } = trpc.products.getAll.useQuery(
		undefined,
		{
			initialData,
			select: supplier
				? (products) =>
						products?.filter(
							(product) =>
								product.supplier.name === supplier,
						)
				: undefined,
		},
	);

	return {
		products: data,
		...query,
	};
};

export const useGetAllProductsToOrder = (
	initialData?: TProductGetAllOutput,
) => {
	const { data, ...query } = trpc.products.getAll.useQuery(
		undefined,
		{
			initialData,
			select: (products) =>
				products?.filter(
					(product) => parseFloat(product.orderAmount) > 0,
				),
		},
	);

	return {
		products: data,
		...query,
	};
};

export const useGetProductById = (id: string) => {
	const { data, ...query } = trpc.products.getById.useQuery({
		id,
	});

	return {
		product: data,
		...query,
	};
};

export const useIsValidToOrder = () => {
	const { products } = useGetAllProductsToOrder();
	const moreThanOneSupplier =
		new Set(products?.map(({ supplierId }) => supplierId)).size >
		1;
	const isValidToOrder = !!products?.length;

	return {
		isValidToOrder,
		moreThanOneSupplier,
	};
};

export const useResetProductsOrderAmountByIds = () => {
	const ctx = trpc.useContext();
	const [searchParams, setSearchParams] = useSearchParams();
	const { selected } = parseSearchParams(searchParams);
	const { mutateAsync, ...mutation } =
		trpc.products.resetOrderAmountByIds.useMutation({
			onMutate: async ({ ids }) => {
				ctx.products.getAll.cancel();
				const previousData = ctx.products.getAll.getData();
				const previousSelected = selected;

				ctx.products.getAll.setData(
					previousData?.map((data: any) =>
						ids.includes(data.id)
							? {
									...data,
									orderAmount: 0,
							  }
							: data,
					),
				);
				searchParams.set('selected', '');
				setSearchParams(searchParams);

				return {
					previousData,
					previousSelected,
					resource: 'product',
					action: 'resetOrderAmount',
				};
			},
			onError: (err, variables, context) => {
				if (!context?.previousData) return;

				ctx.products.getAll.setData(context.previousData);
				searchParams.set(
					'selected',
					context?.previousSelected ?? '',
				);
				setSearchParams(searchParams);
			},
			onSettled: () => {
				ctx.products.getAll.invalidate();
			},
		});
	const onResetOrderAmount = async (data: TIdsSchema) => {
		try {
			return await mutateAsync(data);
		} catch {}
	};

	return {
		onResetOrderAmount,
		...mutation,
	};
};

export const useImportCSV = () => {
	const ctx = trpc.useContext();
	const { mutateAsync, ...mutation } =
		trpc.products.importCSV.useMutation({
			onMutate: async () => {
				ctx.products.getAll.cancel();

				return {
					resource: 'product',
					action: 'importCSV',
				};
			},
			onSettled: () => {
				ctx.products.getAll.invalidate();
			},
		});
	const onImportCSV = async (data: TImportCSVSchema) => {
		try {
			return await mutateAsync(data);
		} catch {}
	};

	return {
		...mutation,
		onImportCSV,
	};
};

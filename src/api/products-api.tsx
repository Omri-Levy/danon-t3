import { trpc } from '../utils/trpc';
import toast from 'react-hot-toast';
import { locale } from '../translations';
import { SubmitHandler } from 'react-hook-form';
import {
	ProductCreateInput,
	ProductDeleteByIdsInput,
	ProductGetAllOutput,
	ProductUpdateByIdInput,
} from '../types';
import { useCallback } from 'react';

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

				return { previousData };
			},
			onSuccess: () => {
				toast.success(
					`${locale.he.actions.success} ${locale.he.actions.product.create}`,
				);
			},
			onError: (err, newData, context) => {
				if (!context?.previousData) return;
				const message =
					err.message ??
					locale.he.actions['product']['create'];

				toast.error(`${locale.he.actions.error} ${message}`);
				ctx.products.getAll.setData(context.previousData);
			},
			onSettled: () => {
				ctx.products.getAll.invalidate();
			},
		});
	const onCreate: SubmitHandler<ProductCreateInput> = async (
		data,
	) => {
		try {
			return await mutateAsync(data);
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

				return { previousData };
			},
			onSuccess: () => {
				toast.success(
					`${locale.he.actions.success} ${locale.he.actions.product.update}`,
				);
			},
			onError: (err, newData, context) => {
				if (!context?.previousData) return;
				const message =
					err.message ?? locale.he.actions.product.update;

				toast.error(`${locale.he.actions.error} ${message}`);
				ctx.products.getAll.setData(context.previousData);
			},
			onSettled: () => {
				ctx.products.getAll.invalidate();
			},
		});
	const onUpdateById: SubmitHandler<
		ProductUpdateByIdInput
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
	setSelectedIds: (ids: Record<PropertyKey, boolean>) => void,
) => {
	const ctx = trpc.useContext();
	const { mutateAsync, ...mutation } =
		trpc.products.deleteByIds.useMutation({
			onMutate: async ({ ids }) => {
				ctx.products.getAll.cancel();
				const previousData = ctx.products.getAll.getData();
				ctx.products.getAll.setData((prevData) =>
					prevData?.filter(
						(data) => !ids.includes(data.id),
					),
				);

				setSelectedIds({});

				return { previousData };
			},
			onSuccess: () => {
				toast.success(
					`${locale.he.actions.success} ${locale.he.actions.product.update}`,
				);
			},
			onError: (err, newData, context) => {
				if (!context?.previousData) return;
				const message =
					err.message ?? locale.he.actions.product.update;

				toast.error(`${locale.he.actions.error} ${message}`);
				ctx.products.getAll.setData(context.previousData);
			},
			onSettled: () => {
				ctx.products.getAll.invalidate();
			},
		});
	const onDeleteByIds: SubmitHandler<
		ProductDeleteByIdsInput
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

export const useGetAllProducts = ({
	initialData,
	select,
}: {
	initialData?: ProductGetAllOutput;
	select?: (data: ProductGetAllOutput) => ProductGetAllOutput;
} = {}) => {
	const { data, ...query } = trpc.products.getAll.useQuery(
		undefined,
		{ initialData, select },
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

export const useProductsToOrder = () =>
	useCallback(
		(products: ProductGetAllOutput) =>
			products?.filter(
				(product) => Number(product.orderAmount) > 0,
			),
		[],
	);

export const useIsValidToOrder = () => {
	const productsToOrderSelector = useProductsToOrder();
	const { products } = useGetAllProducts({
		select: productsToOrderSelector,
	});

	return !!products?.length;
};

export const useResetProductsOrderAmountByIds = (
	setSelectedIds: (ids: Record<PropertyKey, boolean>) => void,
) => {
	const ctx = trpc.useContext();
	const { mutateAsync, ...mutation } =
		trpc.products.resetOrderAmountByIds.useMutation({
			onMutate: async ({ ids }) => {
				ctx.products.getAll.cancel();
				const previousData = ctx.products.getAll.getData();

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
				setSelectedIds({});

				return { previousData };
			},
			onError: (err, variables, context) => {
				if (!context?.previousData) return;

				toast.error(
					`${locale.he.actions.error} ${locale.he.actions.product.resetOrderAmount}`,
				);
				ctx.products.getAll.setData(context.previousData);
				setSelectedIds?.(variables.ids as any);
			},
			onSettled: () => {
				ctx.products.getAll.invalidate();
			},
			onSuccess: () => {
				toast.success(
					`${locale.he.actions.success} ${locale.he.actions.product.resetOrderAmount}`,
				);
			},
		});

	return {
		onResetOrderAmount: mutateAsync,
		...mutation,
	};
};

import { SubmitHandler } from 'react-hook-form';
import {
	TProductGetAllOutput,
	TProductUpdateByIdInput,
} from '../common/types';
import { trpc } from 'src/common/utils/trpc/trpc-clients';

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

export const useGetProductById = (id: string) => {
	const { data, ...query } = trpc.products.getById.useQuery({
		id,
	});

	return {
		product: data,
		...query,
	};
};

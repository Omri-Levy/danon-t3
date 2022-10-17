import {
	DefaultValues,
	FieldValues,
	KeepStateOptions,
	SubmitHandler,
} from 'react-hook-form';
import {
	TSupplierCreateInput,
	TSupplierDeleteByIdsInput,
	TSupplierGetAllOutput,
	TSupplierUpdateByIdInput,
} from '../common/types';
import { trpc } from 'src/common/utils/trpc/trpc-clients';
import { useSearchParams } from 'react-router-dom';
import { parseSearchParams } from '../products/components/ProductsTable/hooks/useProductsTable./useProductsTable';

export const useCreateSupplier = () => {
	const ctx = trpc.useContext();
	const { mutateAsync, ...mutation } =
		trpc.suppliers.create.useMutation({
			onMutate: async (newData) => {
				ctx.suppliers.getAll.cancel();
				const previousData = ctx.suppliers.getAll.getData();

				ctx.suppliers.getAll.setData((prevData: any) => [
					...prevData,
					newData,
				]);

				return {
					previousData,
					resource: 'supplier',
					action: 'create',
				};
			},
			onError: (err, newData, context) => {
				if (!context?.previousData) return;

				ctx.suppliers.getAll.setData(context.previousData);
			},
			onSettled: () => {
				ctx.suppliers.getAll.invalidate();
			},
		});
	const onCreate: (
		reset: (
			values?: DefaultValues<FieldValues> | FieldValues,
			keepStateOptions?: KeepStateOptions,
		) => void,
		focus: () => void,
	) => SubmitHandler<TSupplierCreateInput> =
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

export const useUpdateSupplierById = () => {
	const ctx = trpc.useContext();
	const { mutateAsync, ...mutation } =
		trpc.suppliers.updateById.useMutation({
			onMutate: async (updatedData) => {
				ctx.suppliers.getAll.cancel();
				const previousData = ctx.suppliers.getAll.getData();

				ctx.suppliers.getAll.setData((prevData) =>
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
					resource: 'supplier',
					action: 'update',
				};
			},
			onError: (err, newData, context) => {
				if (!context?.previousData) return;

				ctx.suppliers.getAll.setData(context.previousData);
			},
			onSettled: () => {
				ctx.suppliers.getAll.invalidate();
			},
		});
	const onUpdateById: SubmitHandler<
		TSupplierUpdateByIdInput
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

export const useDeleteSuppliersByIds = (
	onToggleIsDeletingSelectedSuppliers?: (
		nextState?: boolean,
	) => void,
) => {
	const ctx = trpc.useContext();
	const [searchParams, setSearchParams] = useSearchParams();
	const { selected } = parseSearchParams(searchParams);
	const { mutateAsync, ...mutation } =
		trpc.suppliers.deleteByIds.useMutation({
			onMutate: async ({ ids }) => {
				ctx.suppliers.getAll.cancel();
				const previousData = ctx.suppliers.getAll.getData();
				const previousSelected = selected;
				ctx.suppliers.getAll.setData((prevData) =>
					prevData?.filter(
						(data) => !ids.includes(data.id),
					),
				);
				searchParams.set('selected', '');
				setSearchParams(searchParams);

				return {
					previousData,
					previousSelected,
					resource: 'supplier',
					action: 'delete',
				};
			},
			onError: (err, newData, context) => {
				if (!context?.previousData) return;

				ctx.suppliers.getAll.setData(context.previousData);
				searchParams.set(
					'selected',
					context.previousSelected ?? '',
				);
				setSearchParams(searchParams);
			},
			onSuccess: () => {
				onToggleIsDeletingSelectedSuppliers?.(false);
			},
			onSettled: () => {
				ctx.suppliers.getAll.invalidate();
			},
		});
	const onDeleteByIds: SubmitHandler<
		TSupplierDeleteByIdsInput
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

export const useGetAllSuppliers = (
	initialData?: TSupplierGetAllOutput,
) => {
	const { data, ...query } = trpc.suppliers.getAll.useQuery(
		undefined,
		{
			initialData,
		},
	);

	return {
		suppliers: data,
		...query,
	};
};

export const useGetSupplierById = (id: string) => {
	const { data, ...query } = trpc.suppliers.getById.useQuery({
		id,
	});

	return {
		supplier: data,
		...query,
	};
};

export const useGetAllSupplierNames = (
	initialData?: TSupplierGetAllOutput,
) => {
	const { data, ...query } = trpc.suppliers.getAll.useQuery(
		undefined,
		{
			select: (suppliers) => suppliers?.map(({ name }) => name),
			initialData,
		},
	);

	return {
		supplierNames: data,
		...query,
	};
};

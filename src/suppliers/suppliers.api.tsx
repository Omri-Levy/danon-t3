import toast from 'react-hot-toast';
import { locale } from '../common/translations';
import { SubmitHandler } from 'react-hook-form';
import {
	TSupplierCreateInput,
	TSupplierDeleteByIdsInput,
	TSupplierGetAllOutput,
	TSupplierUpdateByIdInput,
} from '../common/types';
import { Dispatch, SetStateAction } from 'react';
import { trpc } from 'src/common/utils/trpc/trpc-clients';

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

				return { previousData };
			},
			onSuccess: () => {
				toast.success(
					`${locale.he.actions.success} ${locale.he.actions.supplier.create}`,
				);
			},
			onError: (err, newData, context) => {
				if (!context?.previousData) return;
				const message =
					err.message ??
					locale.he.actions['supplier']['create'];

				toast.error(`${locale.he.actions.error} ${message}`);
				ctx.suppliers.getAll.setData(context.previousData);
			},
			onSettled: () => {
				ctx.suppliers.getAll.invalidate();
			},
		});
	const onCreate: SubmitHandler<TSupplierCreateInput> = async (
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

				return { previousData };
			},
			onSuccess: () => {
				toast.success(
					`${locale.he.actions.success} ${locale.he.actions.supplier.update}`,
				);
			},
			onError: (err, newData, context) => {
				if (!context?.previousData) return;
				const message =
					err.message ?? locale.he.actions.supplier.update;

				toast.error(`${locale.he.actions.error} ${message}`);
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
	setSelectedIds: Dispatch<
		SetStateAction<Record<PropertyKey, boolean>>
	>,
) => {
	const ctx = trpc.useContext();
	const { mutateAsync, ...mutation } =
		trpc.suppliers.deleteByIds.useMutation({
			onMutate: async ({ ids }) => {
				ctx.suppliers.getAll.cancel();
				const previousData = ctx.suppliers.getAll.getData();
				ctx.suppliers.getAll.setData((prevData) =>
					prevData?.filter(
						(data) => !ids.includes(data.id),
					),
				);

				setSelectedIds({});

				return { previousData };
			},
			onSuccess: () => {
				toast.success(
					`${locale.he.actions.success} ${locale.he.actions.supplier.delete}`,
				);
			},
			onError: (err, newData, context) => {
				if (!context?.previousData) return;
				const message =
					err.message ?? locale.he.actions.supplier.update;

				toast.error(`${locale.he.actions.error} ${message}`);
				ctx.suppliers.getAll.setData(context.previousData);
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

import { trpc } from '../utils/trpc';
import toast from 'react-hot-toast';
import { locale } from '../translations';
import { SubmitHandler } from 'react-hook-form';
import {
	SupplierCreateInput,
	SupplierDeleteByIdsInput,
	SupplierGetAllOutput,
	SupplierUpdateByIdInput,
} from '../types';

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
	const onCreate: SubmitHandler<SupplierCreateInput> = async (
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
		SupplierUpdateByIdInput
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
	setSelectedIds: (ids: Record<PropertyKey, boolean>) => void,
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
	const onDeleteByIds: SubmitHandler<
		SupplierDeleteByIdsInput
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
	initialData?: SupplierGetAllOutput,
) => {
	const { data, ...query } = trpc.suppliers.getAll.useQuery(
		undefined,
		{ initialData },
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
	initialData?: SupplierGetAllOutput,
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

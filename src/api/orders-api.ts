import { trpc } from '../utils/trpc';
import toast from 'react-hot-toast';
import { locale } from '../translations';
import { SubmitHandler } from 'react-hook-form';
import {
	OrderCreateInput,
	OrderDeleteByIdsInput,
	OrderGetAllOutput,
	OrderSendInput,
} from '../types';

export const useCreateOrder = () => {
	const ctx = trpc.useContext();
	const { mutateAsync, ...mutation } =
		trpc.orders.create.useMutation({
			onMutate: async (newData) => {
				ctx.orders.getAll.cancel();
				const previousData = ctx.orders.getAll.getData();

				ctx.orders.getAll.setData((prevData: any) => [
					...prevData,
					newData,
				]);

				return { previousData };
			},
			onSuccess: () => {
				toast.success(
					`${locale.he.actions.success} ${locale.he.actions.order.create}`,
				);
			},
			onError: (err, newData, context) => {
				if (!context?.previousData) return;
				const message =
					err.message ??
					locale.he.actions['order']['create'];

				toast.error(`${locale.he.actions.error} ${message}`);
				ctx.orders.getAll.setData(context.previousData);
			},
			onSettled: () => {
				ctx.orders.getAll.invalidate();
			},
		});
	const onCreate: SubmitHandler<OrderCreateInput> = async (
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

export const useDeleteOrdersByIds = (
	setSelectedIds: (ids: Record<PropertyKey, boolean>) => void,
) => {
	const ctx = trpc.useContext();
	const { mutateAsync, ...mutation } =
		trpc.orders.deleteByIds.useMutation({
			onMutate: async ({ ids }) => {
				ctx.orders.getAll.cancel();
				const previousData = ctx.orders.getAll.getData();
				ctx.orders.getAll.setData((prevData) =>
					prevData?.filter(
						(data) => !ids.includes(data.id),
					),
				);

				setSelectedIds({});

				return { previousData };
			},
			onSuccess: () => {
				toast.success(
					`${locale.he.actions.success} ${locale.he.actions.order.update}`,
				);
			},
			onError: (err, newData, context) => {
				if (!context?.previousData) return;
				const message =
					err.message ?? locale.he.actions.order.update;

				toast.error(`${locale.he.actions.error} ${message}`);
				ctx.orders.getAll.setData(context.previousData);
			},
			onSettled: () => {
				ctx.orders.getAll.invalidate();
			},
		});
	const onDeleteByIds: SubmitHandler<
		OrderDeleteByIdsInput
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

export const useGetAllOrders = (initialData?: OrderGetAllOutput) => {
	const { data, ...query } = trpc.orders.getAll.useQuery(
		undefined,
		{ initialData },
	);

	return {
		orders: data,
		...query,
	};
};

export const useGetOrderById = (id: string) => {
	const { data, ...query } = trpc.orders.getById.useQuery({
		id,
	});

	return {
		order: data,
		...query,
	};
};

export const useSendOrder = () => {
	const ctx = trpc.useContext();
	const { mutateAsync, ...mutation } = trpc.orders.send.useMutation(
		{
			onMutate: async () => {
				ctx.products.getAll.cancel();
			},
			onError: () => {
				toast.error(
					`${locale.he.actions.error} ${locale.he.actions.order.send}`,
				);
			},
			onSuccess: () => {
				toast.success(
					`${locale.he.actions.success} ${locale.he.actions.order.send}`,
				);
			},
			onSettled: () => {
				ctx.products.getAll.invalidate();
			},
		},
	);
	const onSend: SubmitHandler<OrderSendInput> = async (data) => {
		try {
			return await mutateAsync(data);
		} catch {}
	};

	return {
		onSend,
		...mutation,
	};
};

export const useGetOrderPresignedUrlById = ({
	id,
	enabled,
}: {
	id: string;
	enabled: boolean;
}) => {
	return trpc.orders.getPresignedUrlById.useQuery(
		{
			id,
		},
		{
			enabled,
			onError: (err) => {
				toast.error(err.message);
			},
		},
	);
};

import { SubmitHandler } from 'react-hook-form';
import {
	TOrderDeleteByIdsInput,
	TOrderGetAllOutput,
	TOrderSendInput,
} from '../common/types';
import { Dispatch, SetStateAction } from 'react';
import { trpc } from '../common/utils/trpc/trpc-clients';
import { IUseGetOrderPresignedUrlByIdProps } from './interfaces';

export const useDeleteOrdersByIds = (
	setSelectedIds: Dispatch<
		SetStateAction<Record<PropertyKey, boolean>>
	>,
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

				return {
					previousData,
					resource: 'order',
					action: 'delete',
				};
			},
			onError: (err, newData, context) => {
				if (!context?.previousData) return;

				ctx.orders.getAll.setData(context.previousData);
			},
			onSettled: () => {
				ctx.orders.getAll.invalidate();
			},
		});
	const onDeleteByIds: SubmitHandler<
		TOrderDeleteByIdsInput
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

export const useGetAllOrders = (initialData?: TOrderGetAllOutput) => {
	const { data, ...query } = trpc.orders.getAll.useQuery(
		undefined,
		{ initialData },
	);

	return {
		orders: data,
		...query,
	};
};

export const useGetAllOrdersBySupplierName = (
	supplier: string,
	initialData?: TOrderGetAllOutput,
) => {
	const { data, ...query } = trpc.orders.getAll.useQuery(
		undefined,
		{
			initialData,
			select: supplier
				? (orders) =>
						orders?.filter(
							(order) =>
								order.supplier.name === supplier,
						)
				: undefined,
		},
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

				return {
					resource: 'order',
					action: 'delete',
				};
			},
			onSettled: () => {
				ctx.products.getAll.invalidate();
			},
		},
	);
	const onSend: SubmitHandler<TOrderSendInput> = async (data) => {
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
}: IUseGetOrderPresignedUrlByIdProps) => {
	const { data, ...query } =
		trpc.orders.getPresignedUrlById.useQuery(
			{
				id,
			},
			{
				enabled,
			},
		);

	return {
		presignedUrl: data,
		...query,
	};
};

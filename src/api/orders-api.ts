import { trpc } from '../utils/trpc';
import { TrpcApi } from './trpc-api';
import {
	optimisticCreate,
	optimisticDelete,
	optimisticUpdate,
} from './optimistic-updates';

class OrdersApi extends TrpcApi {
	getAll() {
		const { data, ...query } =
			trpc.proxy.orders.getAll.useQuery();

		return {
			orders: data,
			...query,
		};
	}

	getById(id: string) {
		const { data, ...query } = trpc.proxy.orders.getById.useQuery(
			{ id },
		);

		return {
			order: data,
			...query,
		};
	}

	create() {
		const { mutateAsync, ...mutation } =
			trpc.proxy.orders.create.useMutation(
				optimisticCreate(this.ctx, ['orders.getAll']),
			);

		return {
			onCreate: mutateAsync,
			...mutation,
		};
	}

	updateById() {
		const { mutateAsync, ...mutation } =
			trpc.proxy.orders.updateById.useMutation(
				optimisticUpdate(this.ctx, ['orders.getAll']),
			);

		return {
			onUpdateById: mutateAsync,
			...mutation,
		};
	}

	deleteByIds<
		TIds extends Array<string> | Record<PropertyKey, boolean>,
	>(setSelectedIds: (ids: TIds) => void) {
		const { mutateAsync, ...mutation } =
			trpc.proxy.orders.deleteByIds.useMutation(
				optimisticDelete(
					this.ctx,
					['orders.getAll'],
					setSelectedIds,
				),
			);

		return {
			onDeleteByIds: mutateAsync,
			...mutation,
		};
	}

	send() {
		const { mutateAsync, ...mutation } =
			trpc.proxy.orders.send.useMutation({
				onMutate: async () => {
					await this.ctx.cancelQuery(['orders.getAll']);
					const previousData = this.ctx.getQueryData([
						'orders.getAll',
					]);

					this.ctx.setQueryData(
						['orders.getAll'],
						(prevData: any) =>
							prevData?.map((data: any) => ({
								...data,
								orderAmount: 0,
							})),
					);

					return { previousData };
				},
				onError: (err, variables, context) => {
					if (!context?.previousData) return;

					this.ctx.setQueryData(
						['orders.getAll'],
						context.previousData,
					);
				},
				onSettled: () => {
					this.ctx.invalidateQueries(['orders.getAll']);
				},
			});

		return {
			onSend: mutateAsync,
			...mutation,
		};
	}
}

export const createOrdersApi = () => new OrdersApi();

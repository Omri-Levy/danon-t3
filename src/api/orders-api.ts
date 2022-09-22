import { trpc } from '../utils/trpc';
import { TrpcApi } from './trpc-api';
import {
	optimisticCreate,
	optimisticDelete,
	optimisticUpdate,
} from './optimistic-updates';
import { toast } from 'react-hot-toast';
import { locale } from '../translations';

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
				optimisticCreate(
					this.ctx,
					['orders.getAll'],
					'order',
					'create',
				),
			);

		return {
			onCreate: mutateAsync,
			...mutation,
		};
	}

	updateById() {
		const { mutateAsync, ...mutation } =
			trpc.proxy.orders.updateById.useMutation(
				optimisticUpdate(
					this.ctx,
					['orders.getAll'],
					'order',
					'update',
				),
			);

		return {
			onUpdateById: mutateAsync,
			...mutation,
		};
	}

	deleteByIds<
		TIds extends Array<string> | Record<PropertyKey, boolean>,
	>(setSelectedIds?: (ids: TIds) => void) {
		const { mutateAsync, ...mutation } =
			trpc.proxy.orders.deleteByIds.useMutation(
				optimisticDelete(
					this.ctx,
					['orders.getAll'],
					'order',
					'delete',
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
					await this.ctx.cancelQuery(['products.getAll']);
					const previousData = this.ctx.getQueryData([
						'products.getAll',
					]);

					this.ctx.setQueryData(
						['products.getAll'],
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

					toast.error(
						`${locale.he.actions.error} ${locale.he.actions.order.send}`,
					);
					this.ctx.setQueryData(
						['products.getAll'],
						context.previousData,
					);
				},
				onSuccess: () => {
					toast.success(
						`${locale.he.actions.success} ${locale.he.actions.order.send}`,
					);
				},
				onSettled: () => {
					this.ctx.invalidateQueries(['products.getAll']);
				},
			});

		return {
			onSend: mutateAsync,
			...mutation,
		};
	}
}

export const createOrdersApi = () => new OrdersApi();

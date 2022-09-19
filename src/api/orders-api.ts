import { trpc } from '../utils/trpc';
import { TrpcApi } from './trpc-api';

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
			trpc.proxy.orders.create.useMutation();

		return {
			onCreate: mutateAsync,
			...mutation,
		};
	}

	updateById() {
		const { mutateAsync, ...mutation } =
			trpc.proxy.orders.updateById.useMutation();

		return {
			onUpdateById: mutateAsync,
			...mutation,
		};
	}

	deleteByIds() {
		const { mutateAsync, ...mutation } =
			trpc.proxy.orders.deleteByIds.useMutation();

		return {
			onDeleteByIds: mutateAsync,
			...mutation,
		};
	}

	send() {
		const { mutateAsync, ...mutation } =
			trpc.proxy.orders.send.useMutation();

		return {
			onSend: mutateAsync,
			...mutation,
		};
	}
}

export const createOrdersApi = () => new OrdersApi();

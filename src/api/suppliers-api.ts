import { trpc } from '../utils/trpc';
import { TrpcApi } from './trpc-api';

class SuppliersApi extends TrpcApi {
	getAll() {
		const { data, ...query } =
			trpc.proxy.suppliers.getAll.useQuery();

		return {
			suppliers: data,
			...query,
		};
	}

	getById(id: string) {
		const { data, ...query } =
			trpc.proxy.suppliers.getById.useQuery({ id });

		return {
			supplier: data,
			...query,
		};
	}

	create() {
		const { mutateAsync, ...mutation } =
			trpc.proxy.suppliers.create.useMutation();

		return {
			onCreate: mutateAsync,
			...mutation,
		};
	}

	updateById() {
		const { mutateAsync, ...mutation } =
			trpc.proxy.suppliers.updateById.useMutation();

		return {
			onUpdateById: mutateAsync,
			...mutation,
		};
	}

	deleteByIds() {
		const { mutateAsync, ...mutation } =
			trpc.proxy.suppliers.deleteByIds.useMutation();

		return {
			onDeleteByIds: mutateAsync,
			...mutation,
		};
	}
}

export const createSuppliersApi = () => new SuppliersApi();

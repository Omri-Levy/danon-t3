import { trpc } from '../utils/trpc';
import { TrpcApi } from './trpc-api';
import {
	optimisticCreate,
	optimisticDelete,
	optimisticUpdate,
} from './optimistic-updates';

class SuppliersApi extends TrpcApi {
	getAll() {
		const { data, ...query } =
			trpc.proxy.suppliers.getAll.useQuery();

		return {
			suppliers: data,
			...query,
		};
	}

	getAllSupplierNames() {
		const { data, ...query } =
			trpc.proxy.suppliers.getAll.useQuery(undefined, {
				select: (suppliers) =>
					suppliers?.map(({ name }) => name),
			});

		return {
			supplierNames: data,
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
			trpc.proxy.suppliers.create.useMutation(
				optimisticCreate(this.ctx, ['suppliers.getAll']),
			);

		return {
			onCreate: mutateAsync,
			...mutation,
		};
	}

	updateById() {
		const { mutateAsync, ...mutation } =
			trpc.proxy.suppliers.updateById.useMutation(
				optimisticUpdate(this.ctx, ['suppliers.getAll']),
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
			trpc.proxy.suppliers.deleteByIds.useMutation(
				optimisticDelete(
					this.ctx,
					['suppliers.getAll'],
					setSelectedIds,
				),
			);

		return {
			onDeleteByIds: mutateAsync,
			...mutation,
		};
	}
}

export const createSuppliersApi = () => new SuppliersApi();

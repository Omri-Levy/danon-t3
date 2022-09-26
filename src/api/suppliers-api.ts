import { trpc } from '../utils/trpc';
import { TrpcApi } from './trpc-api';
import {
	optimisticCreate,
	optimisticDelete,
	optimisticUpdate,
} from './optimistic-updates';
import { SubmitHandler } from 'react-hook-form';
import { InferMutationInput } from '../types';

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
				optimisticCreate(
					this.ctx,
					['suppliers.getAll'],
					'supplier',
					'create',
				),
			);
		const onCreate: SubmitHandler<
			InferMutationInput<'suppliers.create'>
		> = async (data) => {
			try {
				const result = await mutateAsync(data);

				return result;
			} catch {}
		};

		return {
			onCreate,
			...mutation,
		};
	}

	updateById() {
		const { mutateAsync, ...mutation } =
			trpc.proxy.suppliers.updateById.useMutation(
				optimisticUpdate(
					this.ctx,
					['suppliers.getAll'],
					'supplier',
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
			trpc.proxy.suppliers.deleteByIds.useMutation(
				optimisticDelete(
					this.ctx,
					['suppliers.getAll'],
					'supplier',
					'delete',
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

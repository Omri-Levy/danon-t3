import { trpc } from '../utils/trpc';
import { TrpcApi } from './trpc-api';
import { Product } from '@prisma/client';
import {
	optimisticCreate,
	optimisticDelete,
	optimisticUpdate,
} from './optimistic-updates';
import toast from 'react-hot-toast';
import { locale } from '../translations';

class ProductsApi extends TrpcApi {
	getAll() {
		const { data, ...query } =
			trpc.proxy.products.getAll.useQuery();

		return {
			products: data,
			...query,
		};
	}

	getAllForOrder() {
		const { data, ...query } =
			trpc.proxy.products.getAll.useQuery(undefined, {
				select: (products) =>
					products?.filter(this.validOrder),
			});

		return {
			products: data,
			...query,
		};
	}

	getById(id: string) {
		const { data, ...query } =
			trpc.proxy.products.getById.useQuery({ id });

		return {
			product: data,
			...query,
		};
	}

	create() {
		const { mutateAsync, ...mutation } =
			trpc.proxy.products.create.useMutation(
				optimisticCreate(
					this.ctx,
					['products.getAll'],
					'product',
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
			trpc.proxy.products.updateById.useMutation(
				optimisticUpdate(
					this.ctx,
					['products.getAll'],
					'product',
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
			trpc.proxy.products.deleteByIds.useMutation(
				optimisticDelete(
					this.ctx,
					['products.getAll'],
					'product',
					'delete',
					setSelectedIds,
				),
			);

		return {
			onDeleteByIds: mutateAsync,
			...mutation,
		};
	}

	resetOrderAmount() {
		const { mutateAsync, ...mutation } =
			trpc.proxy.products.resetOrderAmount.useMutation({
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
						`${locale.he.actions.error} ${locale.he.actions.product.resetOrderAmount}`,
					);
					this.ctx.setQueryData(
						['products.getAll'],
						context.previousData,
					);
				},
				onSettled: () => {
					this.ctx.invalidateQueries(['products.getAll']);
				},
				onSuccess: () => {
					toast.success(
						`${locale.he.actions.success} ${locale.he.actions.product.resetOrderAmount}`,
					);
				},
			});

		return {
			onResetOrderAmount: mutateAsync,
			...mutation,
		};
	}

	isValidToOrder() {
		const { products } = this.getAll();

		return products?.some(this.validOrder);
	}

	private validOrder(product: Product) {
		return Number(product.orderAmount) > 0;
	}
}

export const createProductsApi = () => new ProductsApi();

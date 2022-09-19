import { trpc } from '../utils/trpc';
import { TrpcApi } from './trpc-api';
import { Product } from '@prisma/client';

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
			trpc.proxy.products.create.useMutation();

		return {
			onCreate: mutateAsync,
			...mutation,
		};
	}

	updateById() {
		const { mutateAsync, ...mutation } =
			trpc.proxy.products.updateById.useMutation();

		return {
			onUpdateById: mutateAsync,
			...mutation,
		};
	}

	deleteByIds() {
		const { mutateAsync, ...mutation } =
			trpc.proxy.products.deleteByIds.useMutation();

		return {
			onDeleteByIds: mutateAsync,
			...mutation,
		};
	}

	resetOrderAmount() {
		const { mutateAsync, ...mutation } =
			trpc.proxy.products.resetOrderAmount.useMutation();

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

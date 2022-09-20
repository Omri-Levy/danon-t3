import { Prisma } from '@prisma/client';
import { TSupplierIdForeignSchema } from '../../types';
import { TProductIdSchema, TProductIdsSchema } from './types';

class ProductsRepository {
	private _repository = prisma?.product;

	async findMany() {
		return this._repository?.findMany({
			include: {
				supplier: {
					select: {
						name: true,
					},
				},
			},
		});
	}

	async findById({ id }: TProductIdSchema) {
		return this._repository?.findUnique({
			where: {
				id,
			},
		});
	}

	async create({
		supplierId,
		data,
	}: TSupplierIdForeignSchema & {
		data: Prisma.ProductCreateWithoutSupplierInput;
	}) {
		return this._repository?.create({
			data: {
				...data,
				supplier: {
					connect: {
						id: supplierId,
					},
				},
			},
		});
	}

	async updateById({
		id,
		data,
	}: TProductIdSchema & {
		data: Prisma.ProductUpdateInput;
	}) {
		return this._repository?.update({
			where: {
				id,
			},
			data,
		});
	}

	async deleteManyByIds({ ids }: TProductIdsSchema) {
		return this._repository?.deleteMany({
			where: {
				id: {
					in: ids,
				},
			},
		});
	}

	async resetOrderAmount() {
		return this._repository?.updateMany({
			data: {
				orderAmount: 0,
			},
		});
	}
}

export const productsRepository = new ProductsRepository();

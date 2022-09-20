import { Prisma } from '@prisma/client';
import {
	TProductIdSchema,
	TProductIdsSchema,
	TSupplierIdForeignSchema,
} from '../../types';

class ProductsRepository {
	private _repository = prisma?.product;

	findMany() {
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

	findById({ id }: TProductIdSchema) {
		return this._repository?.findUnique({
			where: {
				id,
			},
		});
	}

	create(
		data: TSupplierIdForeignSchema &
			Prisma.ProductCreateWithoutSupplierInput,
	) {
		const { supplierId, ...rest } = data;

		return this._repository?.create({
			data: {
				...rest,
				supplier: {
					connect: {
						id: supplierId,
					},
				},
			},
		});
	}

	updateById({
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

	deleteManyByIds({ ids }: TProductIdsSchema) {
		return this._repository?.deleteMany({
			where: {
				id: {
					in: ids,
				},
			},
		});
	}

	resetOrderAmount() {
		return this._repository?.updateMany({
			data: {
				orderAmount: 0,
			},
		});
	}
}

export const productsRepository = new ProductsRepository();

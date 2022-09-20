import {
	idSchema,
	idsSchema,
	SupplierModel,
} from '../../../prisma/zod';
import { Prisma } from '@prisma/client';
import { z } from 'zod';

class ProductsRepository {
	getAll() {
		return prisma?.product.findMany({
			include: {
				supplier: {
					select: {
						name: true,
					},
				},
			},
		});
	}

	getById({ id }: z.infer<typeof idSchema>) {
		return prisma?.product.findUnique({
			where: {
				id,
			},
		});
	}

	create(
		data: Prisma.ProductCreateWithoutSupplierInput & {
			supplierId: z.infer<typeof SupplierModel.shape.id>;
		},
	) {
		const { supplierId, ...rest } = data;

		return prisma?.product.create({
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
	}: z.infer<typeof idSchema> & {
		data: Prisma.ProductUpdateInput;
	}) {
		return prisma?.product.update({
			where: {
				id,
			},
			data,
		});
	}

	deleteByIds({ ids }: z.infer<typeof idsSchema>) {
		return prisma?.product.deleteMany({
			where: {
				id: {
					in: ids,
				},
			},
		});
	}

	resetOrderAmount() {
		return prisma?.product.updateMany({
			data: {
				orderAmount: 0,
			},
		});
	}
}

export const productsRepository = new ProductsRepository();

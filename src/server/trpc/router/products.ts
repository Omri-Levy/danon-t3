import { t } from '../utils';
import { ProductModel, SupplierModel } from '../../../../prisma/zod';
import { idSchema, idsSchema } from '../../../../prisma/zod/ids';
import { z } from 'zod';

export const productsRouter = t.router({
	getAll: t.procedure.query(() => {
		return prisma?.product.findMany({
			include: {
				supplier: {
					select: {
						name: true,
					},
				},
			},
		});
	}),
	getById: t.procedure.input(idSchema).query(({ input }) => {
		return prisma?.product.findUnique({
			where: { id: input.id },
		});
	}),
	create: t.procedure
		.input(
			ProductModel.pick({
				sku: true,
				name: true,
				unit: true,
				packageSize: true,
				orderAmount: true,
				stock: true,
			}).merge(
				z.object({
					supplier: SupplierModel.shape.name,
				}),
			),
		)
		.mutation(async ({ input }) => {
			const { supplier: supplierName } = input;
			const supplier = await prisma?.supplier.findFirst({
				where: { name: supplierName },
			});

			if (!supplier) {
				throw new Error('Supplier not found');
			}

			return prisma?.product.create({
				data: {
					...input,
					supplier: {
						connect: { id: supplier.id },
					},
				},
			});
		}),
	updateById: t.procedure
		.input(ProductModel.partial().merge(idSchema))
		.mutation(({ input }) => {
			return prisma?.product.update({
				where: { id: input.id },
				data: input,
			});
		}),
	deleteByIds: t.procedure
		.input(idsSchema)
		.mutation(({ input }) => {
			return prisma?.product.deleteMany({
				where: { id: { in: input.ids } },
			});
		}),
	resetOrderAmount: t.procedure.mutation(() => {
		return prisma?.product.updateMany({
			data: {
				orderAmount: 0,
			},
		});
	}),
});

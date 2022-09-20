import { t } from '../trpc/utils';
import { ProductModel, SupplierModel } from '../../../prisma/zod';
import { idSchema, idsSchema } from '../../../prisma/zod/ids';
import { z } from 'zod';
import { productsRepository } from './products.repository';
import { suppliersRepository } from '../suppliers/suppliers.repository';

export const productsRouter = t.router({
	getAll: t.procedure.query(() => {
		return productsRepository.getAll();
	}),
	getById: t.procedure.input(idSchema).query(({ input }) => {
		return productsRepository.getById(input);
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
			const { supplier: name } = input;
			const supplier = await suppliersRepository.getByName({
				name,
			});

			if (!supplier) {
				throw new Error('Supplier not found');
			}

			return productsRepository.create({
				...input,
				supplierId: supplier.id,
			});
		}),
	updateById: t.procedure
		.input(ProductModel.partial().merge(idSchema))
		.mutation(({ input }) => {
			const { id, ...data } = input;

			return productsRepository.updateById({
				id,
				data,
			});
		}),
	deleteByIds: t.procedure
		.input(idsSchema)
		.mutation(({ input }) => {
			return productsRepository.deleteByIds(input);
		}),
	resetOrderAmount: t.procedure.mutation(() => {
		return productsRepository.resetOrderAmount();
	}),
});

import { t } from '../trpc/utils';
import {
	productIdSchema,
	productIdsSchema,
	ProductModel,
	SupplierModel,
} from '../../validation';
import { z } from 'zod';
import { productsRepository } from './products.repository';
import { suppliersRepository } from '../suppliers/suppliers.repository';

export const productsRouter = t.router({
	getAll: t.procedure.query(() => {
		return productsRepository.findMany();
	}),
	getById: t.procedure.input(productIdSchema).query(({ input }) => {
		return productsRepository.findById(input);
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
			const supplier = await suppliersRepository.findByName({
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
		.input(ProductModel.partial().merge(productIdSchema))
		.mutation(({ input }) => {
			const { id, ...data } = input;

			return productsRepository.updateById({
				id,
				data,
			});
		}),
	deleteByIds: t.procedure
		.input(productIdsSchema)
		.mutation(({ input }) => {
			return productsRepository.deleteManyByIds(input);
		}),
	resetOrderAmount: t.procedure.mutation(() => {
		return productsRepository.resetOrderAmount();
	}),
});

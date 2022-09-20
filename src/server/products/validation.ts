import { ProductModel, SupplierModel } from '../../../prisma/zod';
import { z } from 'zod';

export * from '../../../prisma/zod/product';

export const productIdSchema = ProductModel.pick({
	id: true,
});

export const productIdsSchema = z.object({
	ids: z.array(productIdSchema.shape.id),
});

export const createProductSchema = ProductModel.omit({
	id: true,
	supplierId: true,
	createdAt: true,
	updatedAt: true,
}).setKey('supplier', SupplierModel.shape.name);

export const updateProductSchema = ProductModel.partial().setKey(
	'id',
	productIdSchema.shape.id,
);

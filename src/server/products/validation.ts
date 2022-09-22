import { productSchema, supplierSchema } from '../../../prisma/zod';
import { z } from 'zod';

export * from '../../../prisma/zod/product';

export const productIdSchema = productSchema.pick({
	id: true,
});

export const productIdsSchema = z.object({
	ids: z.array(productIdSchema.shape.id),
});

export const createProductSchema = productSchema
	.omit({
		id: true,
		supplierId: true,
		createdAt: true,
		updatedAt: true,
	})
	.setKey('supplier', supplierSchema.shape.name);

export const updateProductSchema = productSchema
	.setKey('supplier', supplierSchema.shape.name)
	.partial()
	.setKey('id', productIdSchema.shape.id);

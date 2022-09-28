import { productSchema, supplierSchema } from '../../../prisma/zod';
import { z } from 'zod';

export * from '../../../prisma/zod/product';

export const productIdSchema = productSchema.pick({
	supplierId: true,
	sku: true,
});

export const productIdsSchema = z.object({
	ids: z.array(productIdSchema),
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
	.setKey('id', productIdSchema);

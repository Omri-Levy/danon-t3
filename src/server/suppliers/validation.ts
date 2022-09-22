import { supplierSchema } from '../../../prisma/zod';
import { z } from 'zod';

export * from '../../../prisma/zod/supplier';

export const supplierIdSchema = supplierSchema.pick({
	id: true,
});

export const supplierIdsSchema = z.object({
	ids: z.array(supplierIdSchema.shape.id),
});

export const createSupplierSchema = supplierSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export const updateSupplierSchema = supplierSchema
	.partial()
	.setKey('id', supplierIdSchema.shape.id);

export const supplierIdForeignSchema = z.object({
	supplierId: supplierIdSchema.shape.id,
});

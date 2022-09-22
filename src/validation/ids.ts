import { z } from 'zod';
import { supplierSchema } from '../../prisma/zod';

export const supplierIdSchema = supplierSchema.pick({
	id: true,
});

export const supplierIdForeignSchema = z.object({
	supplierId: supplierIdSchema.shape.id,
});

export const supplierIdsSchema = z.object({
	ids: z.array(supplierIdSchema.shape.id),
});

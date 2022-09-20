import { z } from 'zod';
import { SupplierModel } from '../../prisma/zod';

export const supplierIdSchema = SupplierModel.pick({
	id: true,
});

export const supplierIdForeignSchema = z.object({
	supplierId: supplierIdSchema.shape.id,
});

export const supplierIdsSchema = z.object({
	ids: z.array(supplierIdSchema.shape.id),
});

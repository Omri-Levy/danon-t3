import { z } from 'zod';
import { ProductModel, SupplierModel } from '../../prisma/zod';

export const productIdSchema = ProductModel.pick({
	id: true,
});

export const productIdsSchema = z.object({
	ids: z.array(productIdSchema.shape.id),
});

export const supplierIdSchema = SupplierModel.pick({
	id: true,
});

export const supplierIdForeignSchema = z.object({
	supplierId: supplierIdSchema.shape.id,
});

export const supplierIdsSchema = z.object({
	ids: z.array(supplierIdSchema.shape.id),
});

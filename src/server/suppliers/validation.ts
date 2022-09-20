import { SupplierModel } from '../../../prisma/zod';
import { z } from 'zod';

export * from '../../../prisma/zod/supplier';

export const supplierIdSchema = SupplierModel.pick({
	id: true,
});

export const supplierIdsSchema = z.object({
	ids: z.array(supplierIdSchema.shape.id),
});

export const createSupplierSchema = SupplierModel.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
}).setKey('supplier', SupplierModel.shape.name);

export const updateSupplierSchema = SupplierModel.partial().setKey(
	'id',
	supplierIdSchema.shape.id,
);

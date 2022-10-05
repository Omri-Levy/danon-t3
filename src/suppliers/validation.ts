import { z } from 'zod';
import {
	ICompleteProduct,
	relatedProductSchema,
} from '../products/validation';
import {
	ICompleteOrder,
	relatedOrderSchema,
} from '../orders/validation';
import { supplierSchema } from '../common/validation';

export interface ICompleteSupplier
	extends z.infer<typeof supplierSchema> {
	products: ICompleteProduct[];
	orders: ICompleteOrder[];
}

/**
 * relatedSupplierSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedSupplierSchema: z.ZodSchema<ICompleteSupplier> =
	z.lazy(() =>
		supplierSchema.extend({
			products: relatedProductSchema.array(),
			orders: relatedOrderSchema.array(),
		}),
	);

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

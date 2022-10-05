import { z } from 'zod';
import {
	ICompleteSupplier,
	relatedSupplierSchema,
} from '../suppliers/validation';
import {
	ICompleteProduct,
	relatedProductSchema,
} from '../products/validation';
import { orderSchema } from '../common/validation';

export interface ICompleteOrder extends z.infer<typeof orderSchema> {
	products: ICompleteProduct[];
	supplier: ICompleteSupplier;
}

/**
 * relatedOrderSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedOrderSchema: z.ZodSchema<ICompleteOrder> = z.lazy(
	() =>
		orderSchema.extend({
			products: relatedProductSchema.array(),
			supplier: relatedSupplierSchema,
		}),
);

export const orderIdSchema = orderSchema.pick({
	id: true,
});

export const orderIdsSchema = z.object({
	ids: z.array(orderIdSchema.shape.id),
});

export const createOrderSchema = orderSchema.omit({
	id: true,
	orderNumber: true,
	createdAt: true,
	updatedAt: true,
});

export const sendOrderSchema = z.object({
	pdf: z.union([z.string(), z.instanceof(ArrayBuffer), z.null()]),
});

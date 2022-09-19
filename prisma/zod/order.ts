import * as z from 'zod';
import {
	CompleteProduct,
	CompleteSupplier,
	RelatedProductModel,
	RelatedSupplierModel,
} from './index';

export const OrderModel = z.object({
	/**
	 * The unique identifier for the supplier
	 * @default {Generated by database}
	 */
	id: z.string(),
	orderNumber: z.number().int(),
	supplierId: z.string(),
	s3Bucket: z.string(),
	s3Key: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export interface CompleteOrder extends z.infer<typeof OrderModel> {
	products: CompleteProduct[];
	supplier: CompleteSupplier;
}

/**
 * RelatedOrderModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedOrderModel: z.ZodSchema<CompleteOrder> = z.lazy(
	() =>
		OrderModel.extend({
			products: RelatedProductModel.array(),
			supplier: RelatedSupplierModel,
		}),
);

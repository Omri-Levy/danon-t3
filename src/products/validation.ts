import { z } from 'zod';
import { Decimal } from 'decimal.js';
import {
	ICompleteSupplier,
	relatedSupplierSchema,
} from '../suppliers/validation';
import {
	ICompleteOrder,
	relatedOrderSchema,
} from '../orders/validation';
import { productSchema, supplierSchema } from '../common/validation';

// Helper schema for Decimal fields
z.instanceof(Decimal)
	.or(z.string())
	.or(z.number())
	.refine((value) => {
		try {
			return new Decimal(value);
		} catch (error) {
			return false;
		}
	})
	.transform((value) => new Decimal(value));

export interface ICompleteProduct
	extends z.infer<typeof productSchema> {
	supplier: ICompleteSupplier;
	order?: ICompleteOrder | null;
}

/**
 * relatedProductSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedProductSchema: z.ZodSchema<ICompleteProduct> =
	z.lazy(() =>
		productSchema.extend({
			supplier: relatedSupplierSchema,
			order: relatedOrderSchema.nullish(),
		}),
	);

// Expects `${supplierId}-${sku}`
export const productIdSchema = z.object({
	id: z.preprocess((v) => {
		if (typeof v !== 'string') {
			return v;
		}

		const [supplierId, sku] = v.split('-');

		return {
			supplierId,
			sku,
		};
	}, productSchema.pick({ supplierId: true, sku: true })),
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

export const importCSVSchema = z.object({
	file: z.any(),
});

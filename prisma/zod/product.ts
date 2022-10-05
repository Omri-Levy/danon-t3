import * as z from 'zod';
import * as imports from '../../src/translations';
import { Decimal } from 'decimal.js';
import { Unit } from '../../src/enums';
import {
	CompleteOrder,
	CompleteSupplier,
	relatedOrderSchema,
	relatedSupplierSchema,
} from './index';

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

export const productSchema = z.object({
	sku: z
		.string()
		.min(1, {
			message: imports.locale.he.validation.product.sku.min,
		})
		.max(10, {
			message: imports.locale.he.validation.product.sku.max,
		}),
	name: z
		.string()
		.min(1, {
			message: imports.locale.he.validation.product.name.min,
		})
		.max(120, {
			message: imports.locale.he.validation.product.name.max,
		}),
	packageSize: z
		.number()
		.min(1, {
			message:
				imports.locale.he.validation.product.packageSize.min,
		})
		.max(1000, {
			message:
				imports.locale.he.validation.product.packageSize.max,
		}),
	unit: z.nativeEnum(Unit),
	orderAmount: z
		.number()
		.min(0, {
			message:
				imports.locale.he.validation.product.orderAmount.min,
		})
		.max(1000, {
			message:
				imports.locale.he.validation.product.orderAmount.max,
		}),
	stock: z
		.number()
		.min(0, {
			message: imports.locale.he.validation.product.stock.min,
		})
		.max(1000, {
			message: imports.locale.he.validation.product.stock.max,
		}),
	supplierId: z.string(),
	orderId: z.string().nullish(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export interface CompleteProduct
	extends z.infer<typeof productSchema> {
	supplier: CompleteSupplier;
	order?: CompleteOrder | null;
}

/**
 * relatedProductSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedProductSchema: z.ZodSchema<CompleteProduct> =
	z.lazy(() =>
		productSchema.extend({
			supplier: relatedSupplierSchema,
			order: relatedOrderSchema.nullish(),
		}),
	);

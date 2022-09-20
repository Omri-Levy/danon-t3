import { z } from 'zod';
import {
	createProductSchema,
	productIdSchema,
	productIdsSchema,
	updateProductSchema,
} from './validation';
import { Product } from '@prisma/client';

export type TProductIdSchema = z.infer<typeof productIdSchema>;
export type TProductIdsSchema = z.infer<typeof productIdsSchema>;
export type TProductId = Product['id'];
export type TProductIds = Array<TProductId>;
export type TCreateProductSchema = z.infer<
	typeof createProductSchema
>;
export type TUpdateProductSchema = z.infer<
	typeof updateProductSchema
>;

import { z } from 'zod';
import {
	createProductSchema,
	productIdSchema,
	productIdsSchema,
	updateProductSchema,
} from './validation';

export type TProductIdSchema = z.infer<typeof productIdSchema>;
export type TProductIdsSchema = z.infer<typeof productIdsSchema>;
export type TCreateProductSchema = z.infer<
	typeof createProductSchema
>;
export type TUpdateProductSchema = z.infer<
	typeof updateProductSchema
>;

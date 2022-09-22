import { orderSchema } from '../../../prisma/zod';
import { z } from 'zod';

export * from '../../../prisma/zod/order';

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

export const updateOrderSchema = orderSchema
	.partial()
	.setKey('id', orderIdSchema.shape.id);

export const sendOrderSchema = z.object({
	pdf: z.union([z.string(), z.instanceof(ArrayBuffer), z.null()]),
});

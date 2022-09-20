import { OrderModel, SupplierModel } from '../../../prisma/zod';
import { z } from 'zod';

export * from '../../../prisma/zod/order';

export const orderIdSchema = OrderModel.pick({
	id: true,
});

export const orderIdsSchema = z.object({
	ids: z.array(orderIdSchema.shape.id),
});

export const createOrderSchema = OrderModel.omit({
	id: true,
	orderNumber: true,
	createdAt: true,
	updatedAt: true,
});

export const updateOrderSchema = OrderModel.partial().setKey(
	'id',
	orderIdSchema.shape.id,
);

export const sendOrderSchema = z
	.object({
		pdf: z.union([
			z.string(),
			z.instanceof(ArrayBuffer),
			z.null(),
		]),
	})
	.merge(
		SupplierModel.pick({
			name: true,
		}),
	);

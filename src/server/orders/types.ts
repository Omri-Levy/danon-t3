import { z } from 'zod';
import {
	createOrderSchema,
	orderIdSchema,
	orderIdsSchema,
	sendOrderSchema,
	updateOrderSchema,
} from './validation';
import { Order } from '@prisma/client';

export type TOrderIdSchema = z.infer<typeof orderIdSchema>;
export type TOrderIdsSchema = z.infer<typeof orderIdsSchema>;
export type TSendOrderSchema = z.infer<typeof sendOrderSchema>;
export type TOrderId = Order['id'];
export type TOrderIds = Array<TOrderId>;
export type TCreateOrderSchema = z.infer<typeof createOrderSchema>;
export type TUpdateOrderSchema = z.infer<typeof updateOrderSchema>;

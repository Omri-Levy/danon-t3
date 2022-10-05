import { z } from 'zod';
import { Order } from '../db/db';
import {
	createOrderSchema,
	orderIdSchema,
	orderIdsSchema,
	sendOrderSchema,
} from './validation';

export type TOrderIdSchema = z.infer<typeof orderIdSchema>;
export type TOrderIdsSchema = z.infer<typeof orderIdsSchema>;
export type TSendOrderSchema = z.infer<typeof sendOrderSchema>;
export type TOrderId = Order['id'];
export type TOrderIds = Array<TOrderId>;
export type TCreateOrderSchema = z.infer<typeof createOrderSchema>;

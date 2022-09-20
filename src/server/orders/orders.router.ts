import { t } from '../trpc/utils';
import { ordersService } from './orders.service';
import {
	createOrderSchema,
	orderIdSchema,
	orderIdsSchema,
	sendOrderSchema,
	updateOrderSchema,
} from './validation';

export const ordersRouter = t.router({
	getAll: t.procedure.query(() => {
		return ordersService.getAll();
	}),
	getById: t.procedure.input(orderIdSchema).query(({ input }) => {
		return ordersService.getById(input);
	}),
	create: t.procedure
		.input(createOrderSchema)
		.mutation(({ input }) => {
			return ordersService.create(input);
		}),
	updateById: t.procedure
		.input(updateOrderSchema)
		.mutation(({ input }) => {
			return ordersService.updateById(input);
		}),
	deleteByIds: t.procedure
		.input(orderIdsSchema)
		.mutation(({ input }) => {
			return ordersService.deleteByIds(input);
		}),
	send: t.procedure
		.input(sendOrderSchema)
		.mutation(async ({ input }) => {
			return ordersService.send(input);
		}),
});

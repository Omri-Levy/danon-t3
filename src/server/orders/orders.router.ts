import { authedProcedure, t } from '../trpc/utils';
import { ordersService } from './orders.service';
import {
	createOrderSchema,
	orderIdSchema,
	orderIdsSchema,
	sendOrderSchema,
	updateOrderSchema,
} from './validation';

export const ordersRouter = t.router({
	getAll: authedProcedure.query(() => {
		return ordersService.getAll();
	}),
	getById: authedProcedure
		.input(orderIdSchema)
		.query(({ input }) => {
			return ordersService.getById(input);
		}),
	create: authedProcedure
		.input(createOrderSchema)
		.mutation(({ input }) => {
			return ordersService.create(input);
		}),
	updateById: authedProcedure
		.input(updateOrderSchema)
		.mutation(({ input }) => {
			return ordersService.updateById(input);
		}),
	deleteByIds: authedProcedure
		.input(orderIdsSchema)
		.mutation(({ input }) => {
			return ordersService.deleteByIds(input);
		}),
	send: authedProcedure
		.input(sendOrderSchema)
		.mutation(async ({ input }) => {
			return ordersService.send(input);
		}),
});

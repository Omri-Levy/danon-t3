import { ordersService } from './orders.service';
import {
	createOrderSchema,
	orderIdSchema,
	orderIdsSchema,
	sendOrderSchema,
} from './validation';
import { trpcServer } from '../trpc/trpc-server';
import { authedProcedure } from '../auth/procedures/auth-procedure';

export const ordersRouter = trpcServer.router({
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
	getPresignedUrlById: authedProcedure
		.input(orderIdSchema)
		.query(async ({ input }) => {
			return ordersService.getPresignedUrlById(input);
		}),
});

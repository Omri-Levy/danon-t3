import { productsService } from './products.service';
import {
	createProductSchema,
	importCSVSchema,
	productIdSchema,
	productIdsSchema,
	updateProductSchema,
} from './validation';
import { trpcServer } from '../trpc/trpc-server';
import { authedProcedure } from '../auth/procedures/auth-procedure';

export const productsRouter = trpcServer.router({
	getAll: authedProcedure.query(() => {
		return productsService.getAll();
	}),
	getById: authedProcedure
		.input(productIdSchema)
		.query(({ input }) => {
			return productsService.getById(input);
		}),
	create: authedProcedure
		.input(createProductSchema)
		.mutation(async ({ input }) => {
			return productsService.create(input);
		}),
	updateById: authedProcedure
		.input(updateProductSchema)
		.mutation(({ input }) => {
			return productsService.updateById(input);
		}),
	deleteByIds: authedProcedure
		.input(productIdsSchema)
		.mutation(({ input }) => {
			return productsService.deleteByIds(input);
		}),
	resetOrderAmountByIds: authedProcedure
		.input(productIdsSchema)
		.mutation(({ input }) => {
			return productsService.resetOrderAmountByIds(input);
		}),
	importCSV: authedProcedure
		.input(importCSVSchema)
		.mutation(({ input }) => {
			return productsService.importCSV(input);
		}),
});

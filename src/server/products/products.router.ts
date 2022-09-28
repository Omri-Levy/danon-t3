import { authedProcedure, t } from '../trpc/utils';
import { productsService } from './products.service';
import {
	createProductSchema,
	productIdSchema,
	productIdsSchema,
	updateProductSchema,
} from './validation';

export const productsRouter = t.router({
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
});

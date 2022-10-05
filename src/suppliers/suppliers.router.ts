import { suppliersService } from './suppliers.service';
import {
	createSupplierSchema,
	supplierIdSchema,
	supplierIdsSchema,
	updateSupplierSchema,
} from './validation';
import { trpcServer } from '../trpc/trpc-server';
import { authedProcedure } from '../auth/procedures/auth-procedure';

export const suppliersRouter = trpcServer.router({
	getAll: authedProcedure.query(() => {
		return suppliersService.getAll();
	}),
	getById: authedProcedure
		.input(supplierIdSchema)
		.query(({ input }) => {
			return suppliersService.getById(input);
		}),
	create: authedProcedure
		.input(createSupplierSchema)
		.mutation(({ input }) => {
			return suppliersService.create(input);
		}),
	updateById: authedProcedure
		.input(updateSupplierSchema)
		.mutation(({ input }) => {
			return suppliersService.updateById(input);
		}),
	deleteByIds: authedProcedure
		.input(supplierIdsSchema)
		.mutation(({ input }) => {
			return suppliersService.deleteByIds(input);
		}),
});

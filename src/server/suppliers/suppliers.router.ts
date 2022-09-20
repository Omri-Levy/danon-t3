import { authedProcedure, t } from '../trpc/utils';
import {
	supplierIdSchema,
	supplierIdsSchema,
} from '../../validation';
import { suppliersService } from './suppliers.service';
import {
	createSupplierSchema,
	updateSupplierSchema,
} from './validation';

export const suppliersRouter = t.router({
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

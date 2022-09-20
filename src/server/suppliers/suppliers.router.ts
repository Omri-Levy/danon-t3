import { authedProcedure, t } from '../trpc/utils';
import {
	supplierIdSchema,
	supplierIdsSchema,
	SupplierModel,
} from '../../validation';
import { suppliersRepository } from './suppliers.repository';

export const suppliersRouter = t.router({
	getAll: authedProcedure.query(() => {
		return suppliersRepository.findMany();
	}),
	getById: authedProcedure
		.input(supplierIdSchema)
		.query(({ input }) => {
			return suppliersRepository.findById(input);
		}),
	create: authedProcedure
		.input(
			SupplierModel.pick({
				email: true,
				name: true,
			}),
		)
		.mutation(({ input }) => {
			return suppliersRepository.create(input);
		}),
	updateById: authedProcedure
		.input(SupplierModel.partial().merge(supplierIdSchema))
		.mutation(({ input }) => {
			const { id, ...data } = input;

			return suppliersRepository.updateById({
				id,
				data,
			});
		}),
	deleteByIds: authedProcedure
		.input(supplierIdsSchema)
		.mutation(({ input }) => {
			return suppliersRepository.deleteManyByIds(input);
		}),
});

import { t } from '../trpc/utils';
import {
	supplierIdSchema,
	supplierIdsSchema,
	SupplierModel,
} from '../../validation';
import { suppliersRepository } from './suppliers.repository';

export const suppliersRouter = t.router({
	getAll: t.procedure.query(() => {
		return suppliersRepository.findMany();
	}),
	getById: t.procedure
		.input(supplierIdSchema)
		.query(({ input }) => {
			return suppliersRepository.findById(input);
		}),
	create: t.procedure
		.input(
			SupplierModel.pick({
				email: true,
				name: true,
			}),
		)
		.mutation(({ input }) => {
			return suppliersRepository.create(input);
		}),
	updateById: t.procedure
		.input(SupplierModel.partial().merge(supplierIdSchema))
		.mutation(({ input }) => {
			const { id, ...data } = input;

			return suppliersRepository.updateById({
				id,
				data,
			});
		}),
	deleteByIds: t.procedure
		.input(supplierIdsSchema)
		.mutation(({ input }) => {
			return suppliersRepository.deleteManyByIds(input);
		}),
});

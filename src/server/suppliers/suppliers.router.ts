import { t } from '../trpc/utils';
import {
	idSchema,
	idsSchema,
	SupplierModel,
} from '../../../prisma/zod';
import { suppliersRepository } from './suppliers.repository';

export const suppliersRouter = t.router({
	getAll: t.procedure.query(() => {
		return suppliersRepository.getAll();
	}),
	getById: t.procedure.input(idSchema).query(({ input }) => {
		return suppliersRepository.getById(input);
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
		.input(SupplierModel.partial().merge(idSchema))
		.mutation(({ input }) => {
			const { id, ...data } = input;

			return suppliersRepository.updateById({
				id,
				data,
			});
		}),
	deleteByIds: t.procedure
		.input(idsSchema)
		.mutation(({ input }) => {
			return suppliersRepository.deleteByIds(input);
		}),
});

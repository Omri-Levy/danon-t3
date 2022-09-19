import { t } from '../utils';
import {
	idSchema,
	idsSchema,
	SupplierModel,
} from '../../../../prisma/zod';

export const suppliersRouter = t.router({
	getAll: t.procedure.query(() => {
		return prisma?.supplier.findMany();
	}),
	getById: t.procedure.input(idSchema).query(({ input }) => {
		return prisma?.supplier.findUnique({
			where: { id: input.id },
		});
	}),
	create: t.procedure
		.input(
			SupplierModel.pick({
				email: true,
				name: true,
			}),
		)
		.mutation(({ input }) => {
			return prisma?.supplier.create({ data: input });
		}),
	updateById: t.procedure
		.input(SupplierModel.partial().merge(idSchema))
		.mutation(({ input }) => {
			return prisma?.supplier.update({
				where: { id: input.id },
				data: input,
			});
		}),
	deleteByIds: t.procedure
		.input(idsSchema)
		.mutation(({ input }) => {
			return prisma?.supplier.deleteMany({
				where: { id: { in: input.ids } },
			});
		}),
});

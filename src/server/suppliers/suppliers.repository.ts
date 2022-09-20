import { idSchema, idsSchema } from '../../../prisma/zod';
import { Prisma } from '@prisma/client';
import { z } from 'zod';

class SuppliersRepository {
	getAll() {
		return prisma?.supplier.findMany();
	}

	getById({ id }: z.infer<typeof idSchema>) {
		return prisma?.supplier.findUnique({
			where: {
				id,
			},
		});
	}

	create(data: Prisma.SupplierCreateInput) {
		return prisma?.supplier.create({
			data,
		});
	}

	updateById({
		id,
		data,
	}: z.infer<typeof idSchema> & {
		data: Prisma.SupplierUpdateInput;
	}) {
		return prisma?.supplier.update({
			where: {
				id,
			},
			data,
		});
	}

	deleteByIds({ ids }: z.infer<typeof idsSchema>) {
		return prisma?.supplier.deleteMany({
			where: {
				id: {
					in: ids,
				},
			},
		});
	}
}

export const suppliersRepository = new SuppliersRepository();

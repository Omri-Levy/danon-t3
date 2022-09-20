import {
	idSchema,
	idsSchema,
	SupplierModel,
} from '../../../prisma/zod';
import { Prisma } from '@prisma/client';
import { z } from 'zod';

class OrdersRepository {
	getAll() {
		return prisma?.order.findMany();
	}

	getById({ id }: z.infer<typeof idSchema>) {
		return prisma?.order.findUnique({
			where: {
				id,
			},
		});
	}

	create(
		data: Prisma.OrderCreateWithoutSupplierInput & {
			supplierId: z.infer<typeof SupplierModel.shape.id>;
		},
	) {
		const { supplierId, ...rest } = data;

		return prisma?.order.create({
			data: {
				...rest,
				supplier: {
					connect: {
						id: supplierId,
					},
				},
			},
		});
	}

	updateById({
		id,
		data,
	}: z.infer<typeof idSchema> & {
		data: Prisma.OrderUpdateInput;
	}) {
		return prisma?.order.update({
			where: {
				id,
			},
			data,
		});
	}

	deleteByIds({ ids }: z.infer<typeof idsSchema>) {
		return prisma?.order.deleteMany({
			where: {
				id: {
					in: ids,
				},
			},
		});
	}
}

export const ordersRepository = new OrdersRepository();

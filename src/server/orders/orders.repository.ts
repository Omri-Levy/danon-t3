import { Prisma } from '@prisma/client';
import { TSupplierIdForeignSchema } from '../../types';
import { TOrderIdSchema, TOrderIdsSchema } from './types';

class OrdersRepository {
	private _repository = prisma?.order;

	findMany() {
		return this._repository?.findMany();
	}

	findById({ id }: TOrderIdSchema) {
		return this._repository?.findUnique({
			where: {
				id,
			},
		});
	}

	create({
		supplierId,
		data,
	}: TSupplierIdForeignSchema & {
		data: Prisma.OrderCreateWithoutSupplierInput;
	}) {
		return this._repository?.create({
			data: {
				...data,
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
	}: TOrderIdSchema & {
		data: Prisma.OrderUpdateInput;
	}) {
		return this._repository?.update({
			where: {
				id,
			},
			data,
		});
	}

	deleteManyByIds({ ids }: TOrderIdsSchema) {
		return this._repository?.deleteMany({
			where: {
				id: {
					in: ids,
				},
			},
		});
	}
}

export const ordersRepository = new OrdersRepository();

import { Prisma } from '@prisma/client';
import { TSupplierIdForeignSchema } from '../suppliers/types';
import { TOrderIdSchema, TOrderIdsSchema } from './types';

class OrdersRepository {
	private _repository = prisma?.order;

	async findMany({
		where,
		include,
	}: {
		where?: Prisma.OrderWhereInput;
		include?: Prisma.OrderInclude;
	} = {}) {
		return this._repository?.findMany({
			where,
			include,
		});
	}

	async findById({ id }: TOrderIdSchema) {
		return this._repository?.findUnique({
			where: {
				id,
			},
		});
	}

	async create({
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

	async updateById({
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

	async deleteManyByIds({ ids }: TOrderIdsSchema) {
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

import { Prisma, Supplier } from '@prisma/client';
import { TSupplierIdForeignSchema } from '../suppliers/types';
import { TOrderIdSchema, TOrderIdsSchema } from './types';
import { suppliersRepository } from '../suppliers/suppliers.repository';
import { TRPCError } from '@trpc/server';

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
			orderBy: {
				createdAt: 'asc',
			},
			include: {
				supplier: {
					select: {
						name: true,
					},
				},
				...include,
			},
			where,
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
		data: Prisma.OrderUpdateInput & {
			supplier?: Supplier['name'];
		};
	}) {
		const { supplier: name, ...rest } = data;
		const supplier = await suppliersRepository.findByName({
			name: name ?? '',
		});
		const { id: supplierId } = supplier ?? {};

		if (name && !supplierId) {
			throw new TRPCError({
				code: 'BAD_REQUEST',
				message: `Supplier with name ${name} does not exist`,
			});
		}

		return this._repository?.update({
			where: {
				id,
			},
			data: {
				...rest,
				supplier:
					supplier && supplierId
						? {
								connect: {
									id: supplierId,
								},
						  }
						: undefined,
			},
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

	async findS3KeyById({ id }: TOrderIdSchema) {
		return this._repository?.findUnique({
			where: {
				id,
			},
			select: {
				s3Key: true,
			},
		});
	}
}

export const ordersRepository = new OrdersRepository();

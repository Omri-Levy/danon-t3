import { Prisma, Supplier } from '@prisma/client';
import { TSupplierIdForeignSchema } from '../suppliers/types';
import { TProductIdSchema, TProductIdsSchema } from './types';
import { suppliersRepository } from '../suppliers/suppliers.repository';
import { TRPCError } from '@trpc/server';
import { prisma } from '../db/client';

class ProductsRepository {
	private _repository = prisma.product;

	async findMany({
		where,
		include,
	}: {
		where?: Prisma.ProductWhereInput;
		include?: Prisma.ProductInclude;
	} = {}) {
		return this._repository.findMany({
			orderBy: {
				name: 'asc',
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

	async findById({ id }: TProductIdSchema) {
		const { supplierId, sku } = id;

		return this._repository.findUnique({
			where: {
				supplierId_sku: {
					supplierId,
					sku,
				},
			},
		});
	}

	async create({
		supplierId,
		data,
	}: TSupplierIdForeignSchema & {
		data: Prisma.ProductCreateWithoutSupplierInput;
	}) {
		return this._repository.create({
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

	async updateMany({
		ids,
		data,
	}: TProductIdsSchema & Prisma.ProductUpdateManyArgs) {
		return this._repository.updateMany({
			where: {
				supplierId: {
					in: ids.map(({ supplierId }) => supplierId),
				},
				sku: {
					in: ids.map(({ sku }) => sku),
				},
			},
			data,
		});
	}

	async updateById({
		id,
		data,
	}: TProductIdSchema & {
		data: Prisma.ProductUpdateInput & {
			supplier?: Supplier['name'];
		};
	}) {
		const { supplier, ...rest } = data;
		const { supplierId, sku } = id;

		const supplierExists = await suppliersRepository.findById({
			id: supplierId,
		});

		if (!supplierExists) {
			throw new TRPCError({
				code: 'BAD_REQUEST',
				message: 'Supplier does not exist',
			});
		}

		return this._repository.update({
			where: {
				supplierId_sku: {
					sku,
					supplierId,
				},
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

	async deleteManyByIds({ ids }: TProductIdsSchema) {
		return this._repository.deleteMany({
			where: {
				supplierId: {
					in: ids.map(({ supplierId }) => supplierId),
				},
				sku: {
					in: ids.map(({ sku }) => sku),
				},
			},
		});
	}

	async resetManyOrderAmountByIds({
		ids,
	}: Partial<TProductIdsSchema> = {}) {
		const inIds = ids?.length
			? {
					supplierId: {
						in: ids.map(({ supplierId }) => supplierId),
					},
					sku: {
						in: ids.map(({ sku }) => sku),
					},
			  }
			: undefined;

		return this._repository.updateMany({
			where: {
				...inIds,
				orderAmount: {
					gt: 0,
				},
			},
			data: {
				orderAmount: 0,
			},
		});
	}
}

export const productsRepository = new ProductsRepository();

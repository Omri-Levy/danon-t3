import { Prisma, Supplier } from '@prisma/client';
import { TSupplierIdForeignSchema } from '../suppliers/types';
import { TProductIdSchema, TProductIdsSchema } from './types';
import { suppliersRepository } from '../suppliers/suppliers.repository';

class ProductsRepository {
	private _repository = prisma?.product;

	async findMany({
		where,
		include,
	}: {
		where?: Prisma.ProductWhereInput;
		include?: Prisma.ProductInclude;
	} = {}) {
		return this._repository?.findMany({
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
		data: Prisma.ProductCreateWithoutSupplierInput;
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
	}: TProductIdSchema & {
		data: Prisma.ProductUpdateInput & {
			supplier?: Supplier['name'];
		};
	}) {
		const { supplier, ...rest } = data;
		const supplierId = supplier
			? await suppliersRepository.findIdByName({
					name: supplier,
			  })
			: undefined;

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

	async deleteManyByIds({ ids }: TProductIdsSchema) {
		return this._repository?.deleteMany({
			where: {
				id: {
					in: ids,
				},
			},
		});
	}

	async resetManyOrderAmountByIds({ ids }: TProductIdsSchema) {
		return this._repository?.updateMany({
			where: {
				id: {
					in: ids,
				},
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

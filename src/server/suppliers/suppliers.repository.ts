import { Prisma, Supplier } from '@prisma/client';
import { TSupplierIdSchema, TSupplierIdsSchema } from './types';

class SuppliersRepository {
	private _repository = prisma?.supplier;

	async findMany({
		where,
		include,
	}: {
		where?: Prisma.SupplierWhereInput;
		include?: Prisma.SupplierInclude;
	} = {}) {
		return this._repository?.findMany({
			where,
			include,
		});
	}

	async findById({ id }: TSupplierIdSchema) {
		return this._repository?.findUnique({
			where: {
				id,
			},
		});
	}

	async findByName({ name }: Pick<Supplier, 'name'>) {
		return this._repository?.findFirst({
			where: {
				name,
			},
		});
	}

	async create(data: Prisma.SupplierCreateInput) {
		return this._repository?.create({
			data,
		});
	}

	async updateById({
		id,
		data,
	}: Pick<Supplier, 'id'> & {
		data: Prisma.SupplierUpdateInput;
	}) {
		return this._repository?.update({
			where: {
				id,
			},
			data,
		});
	}

	async deleteManyByIds({ ids }: TSupplierIdsSchema) {
		return this._repository?.deleteMany({
			where: {
				id: {
					in: ids,
				},
			},
		});
	}

	async findIdByName({ name }: Pick<Supplier, 'name'>) {
		const supplier = await this._repository?.findFirst({
			where: {
				name,
			},
			select: {
				id: true,
			},
		});

		return supplier?.id;
	}
}

export const suppliersRepository = new SuppliersRepository();

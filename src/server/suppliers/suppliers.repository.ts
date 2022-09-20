import { Prisma, Supplier } from '@prisma/client';
import { TSupplierIdSchema, TSupplierIdsSchema } from '../../types';

class SuppliersRepository {
	private _repository = prisma?.supplier;

	findMany() {
		return this._repository?.findMany();
	}

	findById({ id }: TSupplierIdSchema) {
		return this._repository?.findUnique({
			where: {
				id,
			},
		});
	}

	findByName({ name }: Pick<Supplier, 'name'>) {
		return this._repository?.findFirst({
			where: {
				name,
			},
		});
	}

	create(data: Prisma.SupplierCreateInput) {
		return this._repository?.create({
			data,
		});
	}

	updateById({
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

	deleteManyByIds({ ids }: TSupplierIdsSchema) {
		return this._repository?.deleteMany({
			where: {
				id: {
					in: ids,
				},
			},
		});
	}
}

export const suppliersRepository = new SuppliersRepository();

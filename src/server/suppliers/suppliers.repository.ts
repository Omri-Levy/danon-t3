import { TSupplierIdSchema, TSupplierIdsSchema } from './types';
import { db } from '../db/client';
import cuid from 'cuid';
import { Insertable, Updateable } from 'kysely';
import { Supplier } from '../db/db';

class SuppliersRepository {
	private _repository = db;

	async findMany() {
		return this._repository
			.selectFrom('supplier')
			.selectAll()
			.execute();
	}

	async findById({ id }: TSupplierIdSchema) {
		return this._repository
			.selectFrom('supplier')
			.selectAll()
			.where('id', '=', id)
			.executeTakeFirst();
	}

	async findByName({ name }: Pick<Supplier, 'name'>) {
		return this._repository
			.selectFrom('supplier')
			.selectAll()
			.where('name', '=', name)
			.executeTakeFirst();
	}

	async create(data: Omit<Insertable<Supplier>, 'id'>) {
		const id = cuid();

		await this._repository
			.insertInto('supplier')
			.values({ id, ...data })
			.execute();

		return this._repository
			.selectFrom('supplier')
			.selectAll()
			.where('id', '=', id)
			.executeTakeFirst();
	}

	async updateById({
		id,
		data,
	}: Pick<Supplier, 'id'> & {
		data: Omit<Updateable<Supplier>, 'id'>;
	}) {
		await this._repository
			.updateTable('supplier')
			.where('id', '=', id)
			.set(data)
			.execute();

		return this._repository
			.selectFrom('supplier')
			.selectAll()
			.where('id', '=', id)
			.executeTakeFirst();
	}

	async deleteManyByIds({ ids }: TSupplierIdsSchema) {
		await this._repository
			.deleteFrom('supplier')
			.where('id', 'in', ids)
			.execute();

		return this._repository.selectFrom('supplier').selectAll();
	}

	async findIdByName({ name }: Pick<Supplier, 'name'>) {
		const supplier = await this._repository
			.selectFrom('supplier')
			.select('id')
			.where('name', '=', name)
			.executeTakeFirst();

		return supplier?.id;
	}
}

export const suppliersRepository = new SuppliersRepository();

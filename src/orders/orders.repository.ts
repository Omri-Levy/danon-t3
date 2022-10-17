import { TSupplierIdForeignSchema } from '../suppliers/types';
import { TOrderIdSchema, TOrderIdsSchema } from './types';
import { suppliersRepository } from '../suppliers/suppliers.repository';
import { TRPCError } from '@trpc/server';
import { db } from '../db/client';
import cuid from 'cuid';
import { Order, Supplier } from '../db/db';
import { Insertable, Updateable } from 'kysely';

class OrdersRepository {
	private _repository = db;

	async findMany() {
		const orders = await this._repository
			.selectFrom('order')
			.innerJoin('supplier', 'supplier.id', 'order.supplierId')
			.select([
				'order.id',
				'order.supplierId',
				'order.orderNumber',
				'order.s3Key',
				'order.createdAt',
				'order.updatedAt',
				'supplier.name as supplierName',
				'supplier.email',
			])
			.orderBy('order.createdAt', 'asc')
			.execute();

		return orders.map(
			({ supplierId, supplierName, email, ...rest }) => ({
				...rest,
				supplierId,
				supplier: {
					id: supplierId,
					name: supplierName,
					email,
				},
			}),
		);
	}

	async findById({ id }: TOrderIdSchema) {
		return this._repository
			.selectFrom('order')
			.where('id', '=', id)
			.executeTakeFirst();
	}

	async create({
		supplierId,
		data,
	}: TSupplierIdForeignSchema & {
		data: Omit<Insertable<Order>, 'supplierId' | 'id'>;
	}) {
		const id = cuid();

		await this._repository
			.insertInto('order')
			.values({ supplierId, id, ...data })
			.execute();

		return await this._repository
			.selectFrom('order')
			.selectAll()
			.where('id', '=', id)
			.executeTakeFirst();
	}

	async updateById({
		id,
		data,
	}: TOrderIdSchema & {
		data: Updateable<Order> & {
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
				message: `Supplier with name ${name} does not exist`,
				code: 'BAD_REQUEST',
			});
		}

		await this._repository
			.updateTable('order')
			.where('id', '=', id)
			.set({
				supplierId:
					supplier && supplierId ? supplierId : undefined,
				...rest,
			})
			.execute();

		return this._repository
			.selectFrom('order')
			.selectAll()
			.where('id', '=', id)
			.executeTakeFirst();
	}

	async deleteManyByIds({ ids }: TOrderIdsSchema) {
		await this._repository
			.deleteFrom('order')
			.where('id', 'in', ids)
			.execute();

		return this._repository
			.selectFrom('order')
			.selectAll()
			.execute();
	}

	async findS3KeyById({ id }: TOrderIdSchema) {
		return this._repository
			.selectFrom('order')
			.select('s3Key')
			.where('id', '=', id)
			.executeTakeFirst();
	}
}

export const ordersRepository = new OrdersRepository();

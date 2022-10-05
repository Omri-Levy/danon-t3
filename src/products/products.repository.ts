import { TSupplierIdForeignSchema } from '../suppliers/types';
import { TProductIdSchema, TProductIdsSchema } from './types';
import { suppliersRepository } from '../suppliers/suppliers.repository';
import { TRPCError } from '@trpc/server';
import { db } from '../db/client';
import {
	FilterOperator,
	FilterValueExpressionOrList,
} from 'kysely/dist/cjs/parser/filter-parser';
import { DB, Product, Supplier } from '../db/db';
import { From } from 'kysely/dist/cjs/parser/table-parser';
import {
	Insertable,
	ReferenceExpression,
	SelectExpression,
	Updateable,
} from 'kysely';

class ProductsRepository {
	private _repository = db;

	async findMany<RE extends ReferenceExpression<DB, 'product'>>({
		where,
		include,
	}: {
		where?: [
			RE,
			FilterOperator,
			FilterValueExpressionOrList<
				From<DB, 'product'>,
				'product' | 'supplier',
				RE
			>,
		];
		include?: readonly SelectExpression<
			From<DB, 'product'>,
			'product' | 'supplier'
		>[];
	} = {}) {
		let query = this._repository
			.selectFrom('product')
			.innerJoin(
				'supplier',
				'supplier.id',
				'product.supplierId',
			)
			.select([
				'product.supplierId',
				'product.sku',
				'product.name',
				'product.unit',
				'product.packageSize',
				'product.orderAmount',
				'product.stock',
				'product.orderId',
				'supplier.name as supplierName',
				'supplier.email',
			])
			.orderBy('product.name', 'asc');

		if (include) {
			query = query.select(include);
		}

		if (where) {
			query = query.where(...where);
		}

		const products = await query.execute();

		return products.map(
			({ supplierId, email, supplierName, ...rest }) => ({
				supplierId,
				supplier: {
					id: supplierId,
					name: supplierName,
					email,
				},
				...rest,
			}),
		);
	}

	async findById({ id }: TProductIdSchema) {
		const { supplierId, sku } = id;

		return this._repository
			.selectFrom('product')
			.innerJoin(
				'supplier',
				'supplier.id',
				'product.supplierId',
			)
			.selectAll()
			.where('sku', '=', sku)
			.where('supplierId', '=', supplierId)
			.executeTakeFirst();
	}

	async create({
		supplierId,
		data,
	}: TSupplierIdForeignSchema & {
		data: Omit<Insertable<Product>, 'id' | 'supplierId'>;
	}) {
		await this._repository
			.insertInto('product')
			.values({
				supplierId,
				...data,
			})
			.executeTakeFirst();

		return this._repository
			.selectFrom('product')
			.selectAll()
			.where('supplierId', '=', supplierId)
			.where('sku', '=', data.sku)
			.executeTakeFirst();
	}

	async updateMany({
		ids,
		data,
	}: TProductIdsSchema & {
		data: Updateable<Product>;
	}) {
		const supplierIds = ids.map(({ supplierId }) => supplierId);
		const skus = ids.map(({ sku }) => sku);

		await this._repository
			.updateTable('product')
			.where('sku', 'in', skus)
			.where('supplierId', 'in', supplierIds)
			.set(data)
			.execute();

		return this._repository
			.selectFrom('product')
			.selectAll()
			.where('supplierId', 'in', supplierIds)
			.where('sku', 'in', skus)
			.execute();
	}

	async updateById({
		id,
		data,
	}: TProductIdSchema & {
		data: Updateable<Product> & {
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
				message: 'Supplier does not exist',
				code: 'BAD_REQUEST',
			});
		}

		await this._repository
			.updateTable('product')
			.where('sku', '=', sku)
			.where('supplierId', '=', supplierId)
			.set({
				supplierId:
					supplier && supplierId ? supplierId : undefined,
				...rest,
			})
			.execute();

		return this._repository
			.selectFrom('product')
			.selectAll()
			.where('supplierId', '=', supplierId)
			.where('sku', '=', sku)
			.executeTakeFirst();
	}

	async deleteManyByIds({ ids }: TProductIdsSchema) {
		const supplierIds = ids.map(({ supplierId }) => supplierId);
		const skus = ids.map(({ sku }) => sku);

		await this._repository
			.deleteFrom('product')
			.where('supplierId', 'in', supplierIds)
			.where('sku', 'in', skus)
			.execute();

		return this._repository
			.selectFrom('product')
			.selectAll()
			.execute();
	}

	async resetManyOrderAmountByIds({
		ids,
	}: Partial<TProductIdsSchema> = {}) {
		const query = this._repository
			.updateTable('product')
			.set({
				orderAmount: 0,
			})
			.where('orderAmount', '>', '0');

		if (ids?.length) {
			const supplierIds = ids.map(
				({ supplierId }) => supplierId,
			);
			const skus = ids.map(({ sku }) => sku);

			await query
				.where('supplierId', 'in', supplierIds)
				.where('sku', 'in', skus)
				.execute();

			return this._repository
				.selectFrom('product')
				.selectAll()
				.execute();
		}

		return query.execute();
	}
}

export const productsRepository = new ProductsRepository();

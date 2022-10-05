import 'dotenv/config';
import {PlanetScaleDialect} from 'kysely-planetscale';
import {Kysely, MysqlDialect, sql} from 'kysely';
import {createPool} from 'mysql2';
import {fetch} from 'undici';

const Unit = {
	KG: 'KG',
	G: 'G',
	L: 'L',
	ML: 'ML',
	UN: 'UN',
	CC: 'CC',
};
const Units = Object.values(Unit);
Object.freeze(Unit);
Object.freeze(Units);

const db = new Kysely({
	dialect: process.env.NODE_ENV === 'production'
		? new PlanetScaleDialect({
			url: process.env.DATABASE_URL,
			fetch,
		})
		: new MysqlDialect({
			pool: createPool({
				uri: process.env.DATABASE_URL,
			}),
		}),
});

export const up = async () => {
	try {

		// Tables

		// Supplier
		await db.schema
			.createTable('supplier')
			.ifNotExists()
			.addColumn('id', 'char(32)', (col) => col.primaryKey())
			.addColumn('email', 'varchar(320)', (col) =>
				col.notNull().unique(),
			)
			.addColumn('name', 'varchar(120)', (col) =>
				col.notNull().unique(),
			)
			.addColumn('createdAt', 'timestamp', (col) =>
				col.defaultTo(sql`CURRENT_TIMESTAMP`),
			)
			.addColumn('updatedAt', 'datetime', (col) =>
				col.defaultTo(
					sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`,
				),
			)
			.execute();

		// Product
		await db.schema
			.createTable('product')
			.ifNotExists()
			.addColumn('sku', 'varchar(10)', (col) => col.notNull())
			.addColumn('name', 'varchar(120)', (col) => col.notNull())
			.addColumn('packageSize', 'decimal(6,2)', (col) =>
				col.notNull(),
			)
			.addColumn(
				'unit',
				'varchar(2)',
				() => sql`\`unit\` enum(${Units})`,
			)
			.addColumn('orderAmount', 'decimal(6,2)', (col) =>
				col.notNull(),
			)
			.addColumn('stock', 'decimal(6,2)', (col) =>
				col.notNull(),
			)
			.addColumn('supplierId', 'char(32)', (col) =>
				col
					.notNull()
					.references('supplier.id')
					.onDelete('cascade'),
			)
			.addColumn('orderId', 'char(32)', (col) =>
				col.references('order.id'),
			)
			.addColumn('createdAt', 'timestamp', (col) =>
				col.defaultTo(sql`CURRENT_TIMESTAMP`),
			)
			.addColumn('updatedAt', 'datetime', (col) =>
				col.defaultTo(
					sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`,
				),
			)
			.addPrimaryKeyConstraint('product_pk', [
				'supplierId',
				'sku',
			])
			.execute();

		// Order
		await db.schema
			.createTable('order')
			.ifNotExists()
			.addColumn('id', 'char(32)', (col) => col.primaryKey())
			.addColumn('orderNumber', 'integer', (col) =>
				// .unique() to satisfy the one auto column error.
				col.autoIncrement().unique(),
			)
			.addColumn('supplierId', 'char(32)', (col) =>
				col.notNull().references('supplier.id'),
			)
			.addColumn('s3Key', 'varchar(320)', (col) =>
				col.notNull().references('supplier.id'),
			)
			.addColumn('createdAt', 'timestamp', (col) =>
				col.defaultTo(sql`CURRENT_TIMESTAMP`),
			)
			.addColumn('updatedAt', 'datetime', (col) =>
				col.defaultTo(
					sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`,
				),
			)
			.execute();

		// Necessary for Next auth

		// Account
		await db.schema
			.createTable('account')
			.ifNotExists()
			.addColumn('refresh_token', 'text', (col) => col)
			.addColumn('access_token', 'text', (col) => col)
			.addColumn('expires_at', 'integer', (col) => col)
			.addColumn('token_type', 'varchar(255)', (col) => col)
			.addColumn('id_token', 'text', (col) => col.notNull())
			.addColumn('session_state', 'varchar(255)', (col) => col)
			.addColumn('ext_expires_in', 'integer', (col) =>
				col.notNull(),
			)
			.addColumn('id', 'char(32)', (col) => col.primaryKey())
			.addColumn('type', 'varchar(255)', (col) => col.notNull())
			.addColumn('provider', 'varchar(255)', (col) =>
				col.notNull(),
			)
			.addColumn('providerAccountId', 'varchar(255)', (col) =>
				col.notNull(),
			)
			.addColumn('scope', 'varchar(255)', (col) => col)
			.addColumn('userId', 'char(32)', (col) =>
				col
					.notNull()
					.references('user.id')
					.onDelete('cascade'),
			)
			.addColumn('createdAt', 'timestamp', (col) =>
				col.defaultTo(sql`CURRENT_TIMESTAMP`),
			)
			.addColumn('updatedAt', 'datetime', (col) =>
				col.defaultTo(
					sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`,
				),
			)
			.addUniqueConstraint(
				'account_unique_provider_provider_account_id',
				['provider', 'providerAccountId'],
			)
			.execute();

		// Session
		await db.schema
			.createTable('session')
			.ifNotExists()
			.addColumn('id', 'char(32)', (col) => col.primaryKey())
			.addColumn('sessionToken', 'varchar(255)', (col) =>
				col.notNull().unique(),
			)
			.addColumn('userId', 'char(32)', (col) =>
				col
					.notNull()
					.references('user.id')
					.onDelete('cascade'),
			)
			.addColumn('expires', 'timestamp', (col) => col.notNull())
			.addColumn('createdAt', 'timestamp', (col) =>
				col.defaultTo(sql`CURRENT_TIMESTAMP`),
			)
			.addColumn('updatedAt', 'datetime', (col) =>
				col.defaultTo(
					sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`,
				),
			)
			.execute();

		// User
		await db.schema
			.createTable('user')
			.ifNotExists()
			.addColumn('id', 'char(32)', (col) => col.primaryKey())
			.addColumn('name', 'varchar(255)', (col) => col.notNull())
			.addColumn('email', 'varchar(255)', (col) => col.unique())
			.addColumn('emailVerified', 'timestamp', (col) => col)
			.addColumn('image', 'varchar(255)', (col) => col)
			.addColumn('createdAt', 'timestamp', (col) =>
				col.defaultTo(sql`CURRENT_TIMESTAMP`),
			)
			.addColumn('updatedAt', 'datetime', (col) =>
				col.defaultTo(
					sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`,
				),
			)
			.execute();

		// Verification token
		await db.schema
			.createTable('verificationToken')
			.ifNotExists()
			.addColumn('identifier', 'varchar(255)', (col) =>
				col.notNull(),
			)
			.addColumn('token', 'varchar(255)', (col) =>
				col.notNull().unique(),
			)
			.addColumn('expires', 'timestamp', (col) => col.notNull())
			.addColumn('createdAt', 'timestamp', (col) =>
				col.defaultTo(sql`CURRENT_TIMESTAMP`),
			)
			.addColumn('updatedAt', 'datetime', (col) =>
				col.defaultTo(
					sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`,
				),
			)
			.addPrimaryKeyConstraint('verification_token_pk', [
				'identifier',
				'token',
			])
			.execute();

		// Indexes

		// Supplier
		await db.schema
			.createIndex('supplier_name_index')
			.on('supplier')
			.column('name')
			.execute();

		// Product
		await db.schema
			.createIndex('product_sku_index')
			.on('product')
			.column('sku')
			.execute();

		await db.schema
			.createIndex('product_supplier_id_index')
			.on('product')
			.column('supplierId')
			.execute();

		await db.schema
			.createIndex('product_order_amount_index')
			.on('product')
			.expression(sql`orderAmount ASC`)
			.execute();

		// Order
		await db.schema
			.createIndex('order_number_index')
			.on('order')
			.column('orderNumber')
			.execute();

		// Account
		await db.schema
			.createIndex('provider_index')
			.on('account')
			.column('provider')
			.execute();

		await db.schema
			.createIndex('provider_account_id_index')
			.on('account')
			.column('providerAccountId')
			.execute();

		// Session
		await db.schema
			.createIndex('user_id_index')
			.on('session')
			.column('userId')
			.execute();

		await db.destroy();
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
};

export const down = async () => {
	try {
		await db.schema.dropTable('supplier').ifExists().execute();
		await db.schema.dropTable('product').ifExists().execute();
		await db.schema.dropTable('order').ifExists().execute();
		await db.schema.dropTable('account').ifExists().execute();
		await db.schema.dropTable('session').ifExists().execute();
		await db.schema
			.dropTable('verification_token')
			.ifExists()
			.execute();
		await db.destroy();
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
};

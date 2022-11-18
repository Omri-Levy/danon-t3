import 'dotenv/config';
import {PlanetScaleDialect} from 'kysely-planetscale';
import {Kysely, MysqlDialect} from 'kysely';
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

		// Product
		await db.schema
			.alterTable('product')
			.addColumn('pricePerUnit', 'decimal(6,2)', (col) =>
				col.notNull(),
			)
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

import 'dotenv/config';
import {PlanetScaleDialect} from "kysely-planetscale";
import {Kysely, MysqlDialect} from "kysely";
import {createPool} from "mysql2";

(async () => {
	try {
		const dialect =
			process.env.NODE_ENV === 'production'
				? new PlanetScaleDialect({
					url: process.env.DATABASE_URL,
				})
				: new MysqlDialect({
					pool: createPool({
						uri: process.env.DATABASE_URL,
					}),
				});

		const db = new Kysely({
			dialect,
		});


		await db
			.schema
			.dropTable('supplier')
			.ifExists()
			.execute();
		await db
			.schema
			.dropTable('product')
			.ifExists()
			.execute();
		await db
			.schema
			.dropTable('order')
			.ifExists()
			.execute();
		await db
			.schema
			.dropTable('account')
			.ifExists()
			.execute();
		await db
			.schema
			.dropTable('session')
			.ifExists()
			.execute();
		await db
			.schema
			.dropTable('verification_token')
			.ifExists()
			.execute();
		await db.destroy();
	} catch (err) {
		console.error(err);
	}
})();

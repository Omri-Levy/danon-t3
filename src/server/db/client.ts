import { Kysely, MysqlDialect } from 'kysely';
import { PlanetScaleDialect } from 'kysely-planetscale';
import { DB } from './db.d';
import { createPool } from 'mysql2';

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

export const db = new Kysely<DB>({
	dialect,
});

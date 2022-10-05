import { Kysely, MysqlDialect } from 'kysely';
import { PlanetScaleDialect } from 'kysely-planetscale';
import { DB } from './db';
import { createPool } from 'mysql2';
import { fetch } from 'undici';

export const db = new Kysely<DB>({
	dialect:
		process.env.NODE_ENV === 'production'
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

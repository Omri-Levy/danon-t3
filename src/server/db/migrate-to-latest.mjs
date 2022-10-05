import 'dotenv/config';
import path from 'path';
import {promises as fs} from 'fs';
import {
	FileMigrationProvider,
	Kysely,
	Migrator,
	MysqlDialect
} from 'kysely';
import {PlanetScaleDialect} from "kysely-planetscale";
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

		const migrator = new Migrator({
			db,
			provider: new FileMigrationProvider({
				fs,
				path,
				migrationFolder: 'src/server/db/migrations',
			}),
		});
		const {error, results} = await migrator.migrateToLatest();

		results?.forEach(({status, migrationName}) => {
			if (status === 'Success') {
				return console.log(
					`migration "${migrationName}" was executed successfully`,
				);
			}

			if (status === 'Error') {
				return console.error(
					`failed to execute migration "${migrationName}"`,
				);
			}

			console.log(`migration "${migrationName}" was skipped`);
		});

		if (error) {
			console.error('failed to migrate');
			console.error(error);
			process.exit(1);
		}

		await db.destroy();
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
})();

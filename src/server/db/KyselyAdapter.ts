import cuid from 'cuid';
import type { Kysely } from 'kysely';
import type { Account } from 'next-auth';
import type {
	Adapter,
	AdapterSession,
	AdapterUser,
	VerificationToken,
} from 'next-auth/adapters';
import type { DB } from './db.d';

export const KyselyAdapter = (
	db: Kysely<DB>,
	options = {},
): Adapter => {
	return {
		createUser: async (data) => {
			const id = cuid();

			await db
				.insertInto('user')
				.values({
					...data,
					id,
				})
				.executeTakeFirstOrThrow();

			const user = await db
				.selectFrom('user')
				.selectAll()
				.where('id', '=', id)
				.castTo<AdapterUser>()
				.executeTakeFirstOrThrow();

			return user ?? null;
		},
		getUser: async (id) => {
			const user = await db
				.selectFrom('user')
				.selectAll()
				.where('id', '=', id)
				.castTo<AdapterUser>()
				.executeTakeFirst();

			return user ?? null;
		},
		getUserByEmail: async (email) => {
			const user = await db
				.selectFrom('user')
				.selectAll()
				.where('email', '=', email)
				.castTo<AdapterUser>()
				.executeTakeFirst();

			return user ?? null;
		},
		getUserByAccount: async ({ providerAccountId }) => {
			const account = await db
				.selectFrom('account')
				.innerJoin('user', 'account.userId', 'user.id')
				.selectAll()
				.where('providerAccountId', '=', providerAccountId)
				.executeTakeFirst();

			if (!account) return null;

			const {
				userId: id,
				emailVerified,
				name,
				email,
				image,
			} = account;
			const user = {
				id,
				emailVerified: emailVerified
					? new Date(emailVerified.toString())
					: null,
				name,
				email,
				image,
			};

			return user ?? null;
		},
		updateUser: async ({ id, ...data }) => {
			if (!id) {
				throw new Error('User id is required');
			}

			const user = await db
				.updateTable('user')
				.where('id', '=', id)
				.set(data)
				.castTo<AdapterUser>()
				.executeTakeFirstOrThrow();

			return user ?? null;
		},
		deleteUser: async (id) => {
			if (!id) {
				throw new Error('User id is required');
			}

			const user = await db
				.deleteFrom('user')
				.where('id', '=', id)
				.castTo<AdapterUser>()
				.executeTakeFirstOrThrow();

			return user ?? null;
		},
		linkAccount: async (data) => {
			const account = await db
				.insertInto('account')
				.values({
					...data,
					id: cuid(),
				})
				.castTo<Account>()
				.executeTakeFirstOrThrow();

			return account ?? null;
		},
		unlinkAccount: async ({ providerAccountId }) => {
			const account = await db
				.deleteFrom('account')
				.where('providerAccountId', '=', providerAccountId)
				.castTo<Account>()
				.executeTakeFirstOrThrow();

			return account;
		},
		async getSessionAndUser(sessionTokenInput) {
			const userAndSession = await db
				.selectFrom('session')
				.innerJoin('user', 'session.userId', 'user.id')
				.selectAll()
				.where('session.sessionToken', '=', sessionTokenInput)
				.executeTakeFirst();

			if (!userAndSession) return null;

			const {
				email,
				emailVerified,
				expires,
				id,
				image,
				name,
				sessionToken,
				userId,
			} = userAndSession;
			const user = {
				id: userId,
				emailVerified: emailVerified
					? new Date(emailVerified.toString())
					: null,
				name,
				email,
				image,
			};
			const session = {
				id,
				sessionToken,
				userId,
				expires: new Date(expires.toString()),
			};

			return {
				user,
				session,
			};
		},
		createSession: async (data) => {
			const id = cuid();
			await db
				.insertInto('session')
				.values({
					...data,
					id,
				})
				.executeTakeFirstOrThrow();

			const session = await db
				.selectFrom('session')
				.selectAll()
				.where('id', '=', id)
				.castTo<AdapterSession>()
				.executeTakeFirstOrThrow();

			return session ?? null;
		},
		updateSession: async (data) => {
			const session = await db
				.updateTable('session')
				.where('sessionToken', '=', data.sessionToken)
				.set(data)
				.castTo<AdapterSession>()
				.executeTakeFirstOrThrow();

			return session ?? null;
		},
		deleteSession: async (sessionToken) => {
			const session = await db
				.deleteFrom('session')
				.where('sessionToken', '=', sessionToken)
				.castTo<AdapterSession>()
				.executeTakeFirstOrThrow();

			return session ?? null;
		},
		async createVerificationToken(data) {
			const verificationToken = await db
				.insertInto('verificationToken')
				.values(data)
				.castTo<VerificationToken>()
				.executeTakeFirstOrThrow();

			return verificationToken ?? null;
		},
		async useVerificationToken({ identifier, token }) {
			const verificationToken = await db
				.deleteFrom('verificationToken')
				.where('identifier', '=', identifier)
				.where('token', '=', token)
				.castTo<VerificationToken>()
				.executeTakeFirst();

			return verificationToken ?? null;
		},
	};
};

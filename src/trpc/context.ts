import trpc from '@trpc/server';
import trpcNext from '@trpc/server/adapters/next';
import { unstable_getServerSession as getServerSession } from 'next-auth';

import { authOptions as nextAuthOptions } from '../pages/api/auth/[...nextauth]';
import { db } from '../db/client';

export const createContext = async (
	opts: trpcNext.CreateNextContextOptions,
) => {
	const session = await getServerSession(
		opts.req,
		opts.res,
		nextAuthOptions,
	);

	return {
		session,
		db,
	};
};

export type TContext = trpc.inferAsyncReturnType<
	typeof createContext
>;

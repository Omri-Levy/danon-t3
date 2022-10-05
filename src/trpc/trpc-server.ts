import { initTRPC } from '@trpc/server';
import type { TContext } from './context';
import superjson from 'superjson';
import { ZodError } from 'zod';

export const trpcServer = initTRPC.context<TContext>().create({
	transformer: superjson,
	errorFormatter({ shape, error }) {
		return {
			...shape,
			data: {
				...shape.data,
				zodError:
					error.code === 'BAD_REQUEST' &&
					error.cause instanceof ZodError
						? error.cause.flatten()
						: null,
			},
		};
	},
});

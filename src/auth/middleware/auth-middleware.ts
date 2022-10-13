import { TRPCError } from '@trpc/server';
import { trpcServer } from '../../trpc/trpc-server';
import produce from 'immer';

export const authMiddleware = trpcServer.middleware(
	({ ctx, next }) => {
		if (!ctx.session?.user) {
			throw new TRPCError({ code: 'UNAUTHORIZED' });
		}

		return next({
			ctx: produce(ctx, (draft) => {
				draft.session!.user = ctx.session!.user;
			}),
		});
	},
);

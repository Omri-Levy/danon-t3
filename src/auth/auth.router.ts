import { trpcServer } from '../trpc/trpc-server';

export const authRouter = trpcServer.router({
	getSession: trpcServer.procedure.query(({ ctx }) => {
		return ctx.session;
	}),
});

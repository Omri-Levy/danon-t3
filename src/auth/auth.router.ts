import { t } from '../server/trpc/utils';

export const authRouter = t.router({
	getSession: t.procedure.query(({ ctx }) => {
		return ctx.session;
	}),
});

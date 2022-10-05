import { trpcServer } from '../../trpc/trpc-server';
import { authMiddleware } from '../middleware/auth-middleware';

export const authedProcedure =
	trpcServer.procedure.use(authMiddleware);

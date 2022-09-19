// src/server/trpc/router/index.ts
import { t } from '../utils';
import { productsRouter } from './products';
import { suppliersRouter } from './suppliers';
import { ordersRouter } from './orders';
import { authRouter } from '../../../auth/auth';

export const appRouter = t.router({
	products: productsRouter,
	suppliers: suppliersRouter,
	orders: ordersRouter,
	auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

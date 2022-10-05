import { trpcServer } from './trpc-server';
import { productsRouter } from '../products/products.router';
import { suppliersRouter } from '../suppliers/suppliers.router';
import { ordersRouter } from '../orders/orders.router';
import { authRouter } from '../auth/auth.router';

export const appRouter = trpcServer.router({
	products: productsRouter,
	suppliers: suppliersRouter,
	orders: ordersRouter,
	auth: authRouter,
});

// export type definition of API
export type TAppRouter = typeof appRouter;

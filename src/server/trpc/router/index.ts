import { t } from '../utils';
import { productsRouter } from './products';
import { ordersRouter } from '../../orders/orders.router';
import { authRouter } from '../../auth/auth.router';
import { suppliersRouter } from '../../suppliers/suppliers.router';

export const appRouter = t.router({
	products: productsRouter,
	suppliers: suppliersRouter,
	orders: ordersRouter,
	auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

import { createNextApiHandler } from '@trpc/server/adapters/next';
import { createContext } from '../../../trpc/context';
import { appRouter } from '../../../trpc/app-router';

// export API handler
export default createNextApiHandler({
	router: appRouter,
	createContext: createContext,
});

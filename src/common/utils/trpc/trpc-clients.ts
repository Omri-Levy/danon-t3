import { createTRPCProxyClient, createTRPCReact } from '@trpc/react';
import superjson from 'superjson';
import { httpBatchLink } from '@trpc/client';
import { getBaseUrl } from './get-base-url';
import type { TAppRouter } from '../../../trpc/app-router';

export const trpcOptions = {
	transformer: superjson,
	links: [
		httpBatchLink({
			url: `${getBaseUrl()}/api/trpc`,
		}),
	],
};

export const trpc = createTRPCReact<TAppRouter>();
export const trpcClient = trpc.createClient(trpcOptions);
export const trpcProxyClient =
	createTRPCProxyClient<TAppRouter>(trpcOptions);

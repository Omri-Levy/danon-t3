import type { AppRouter } from '../server';
import { createTRPCProxyClient, createTRPCReact } from '@trpc/react';
import superjson from 'superjson';
import { httpBatchLink } from '@trpc/client';
import { QueryClient } from '@tanstack/react-query';

export const getBaseUrl = () => {
	if (typeof window !== 'undefined') return ''; // browser should use relative url
	if (process.env.VERCEL_URL)
		return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url

	return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};
export const trpcOptions = {
	transformer: superjson,
	links: [
		httpBatchLink({
			url: `${getBaseUrl()}/api/trpc`,
		}),
	],
};
export const trpc = createTRPCReact<AppRouter>();
export const trpcClient = trpc.createClient(trpcOptions);
export const trpcProxyClient =
	createTRPCProxyClient<AppRouter>(trpcOptions);
export const queryClient = new QueryClient();

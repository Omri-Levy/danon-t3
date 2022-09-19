// src/utils/trpc.ts
import { setupTRPC } from '@trpc/next';
import type {
	inferProcedureInput,
	inferProcedureOutput,
	inferSubscriptionOutput,
} from '@trpc/server';
import type { AppRouter } from '../server/trpc/router';
import superjson from 'superjson';

const getBaseUrl = () => {
	if (typeof window !== 'undefined') return ''; // browser should use relative url
	if (process.env.VERCEL_URL)
		return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url

	return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

export const trpc = setupTRPC<AppRouter>({
	config() {
		return {
			url: `${getBaseUrl()}/api/trpc`,
			transformer: superjson,
		};
	},
	ssr: false,
});

/**
 * Enum containing all api query paths
 */
export type TQuery = keyof AppRouter['_def']['queries'];

/**
 * Enum containing all api mutation paths
 */
export type TMutation = keyof AppRouter['_def']['mutations'];
/**
 * Enum containing all api subscription paths
 */
export type TSubscription = keyof AppRouter['_def']['subscriptions'];
/**
 * This is a helper method to infer the output of a query resolver
 * @example type HelloOutput = InferQueryOutput<'hello'>
 */
export type InferQueryOutput<TRouteKey extends TQuery> =
	inferProcedureOutput<AppRouter['_def']['queries'][TRouteKey]>;
/**
 * This is a helper method to infer the input of a query resolver
 * @example type HelloInput = InferQueryInput<'hello'>
 */
export type InferQueryInput<TRouteKey extends TQuery> =
	inferProcedureInput<AppRouter['_def']['queries'][TRouteKey]>;
/**
 * This is a helper method to infer the output of a mutation resolver
 * @example type HelloOutput = InferMutationOutput<'hello'>
 */
export type InferMutationOutput<TRouteKey extends TMutation> =
	inferProcedureOutput<AppRouter['_def']['mutations'][TRouteKey]>;
/**
 * This is a helper method to infer the input of a mutation resolver
 * @example type HelloInput = InferMutationInput<'hello'>
 */
export type InferMutationInput<TRouteKey extends TMutation> =
	inferProcedureInput<AppRouter['_def']['mutations'][TRouteKey]>;
/**
 * This is a helper method to infer the output of a subscription resolver
 * @example type HelloOutput = InferSubscriptionOutput<'hello'>
 */
export type InferSubscriptionOutput<TRouteKey extends TSubscription> =
	inferProcedureOutput<
		AppRouter['_def']['subscriptions'][TRouteKey]
	>;
/**
 * This is a helper method to infer the asynchronous output of a subscription resolver
 * @example type HelloAsyncOutput = InferAsyncSubscriptionOutput<'hello'>
 */
export type InferAsyncSubscriptionOutput<
	TRouteKey extends TSubscription,
> = inferSubscriptionOutput<AppRouter, TRouteKey>;
/**
 * This is a helper method to infer the input of a subscription resolver
 * @example type HelloInput = InferSubscriptionInput<'hello'>
 */
export type InferSubscriptionInput<TRouteKey extends TSubscription> =
	inferProcedureInput<
		AppRouter['_def']['subscriptions'][TRouteKey]
	>;

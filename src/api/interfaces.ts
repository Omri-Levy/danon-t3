import { UseTRPCMutationOptions } from '@trpc/react/dist/createReactQueryHooks';

export interface IOptimisticUpdate<
	TOptions extends UseTRPCMutationOptions<any, any, any, any>,
> {
	onMutate: TOptions['onMutate'];
	onError: TOptions['onError'];
	onSettled: TOptions['onSettled'];
}

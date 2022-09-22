import { UseTRPCMutationOptions } from '@trpc/react/dist/createReactQueryHooks';
import { InferQueryInput, TQuery } from '../types';
import { TRPCContextState } from '@trpc/react/dist/internals/context';
import { AppRouter } from '../server';
import { NextPageContext } from 'next';
import { IOptimisticUpdate } from './interfaces';

export const optimisticUpdates = <
	TOptions extends UseTRPCMutationOptions<any, any, any, any>,
	TKey extends TQuery = TQuery,
>(
	ctx: TRPCContextState<AppRouter, NextPageContext>,
	queryKey: [TKey, InferQueryInput<TKey>] | [TKey],
	onError?: <
		TData extends Parameters<
			Exclude<TOptions['onError'], undefined>
		>[1],
	>(
		prevData: TData,
	) => void,
): Omit<IOptimisticUpdate<TOptions>, 'onMutate'> => ({
	onError: (err, newData, context) => {
		if (!context?.previousData) return;

		ctx.setQueryData(queryKey, context.previousData);
		onError?.(newData);
	},
	onSettled: () => {
		ctx.invalidateQueries(queryKey);
	},
});
export const optimisticCreate = <
	TOptions extends UseTRPCMutationOptions<any, any, any, any>,
	TKey extends TQuery = TQuery,
>(
	ctx: TRPCContextState<AppRouter, NextPageContext>,
	queryKey: [TKey, InferQueryInput<TKey>] | [TKey],
): IOptimisticUpdate<TOptions> => ({
	onMutate: async (newData) => {
		await ctx.cancelQuery(queryKey);
		const previousData = ctx.getQueryData(queryKey);

		ctx.setQueryData(queryKey, (prevData: any) => [
			...prevData,
			newData,
		]);

		return { previousData };
	},
	...optimisticUpdates(ctx, queryKey),
});
export const optimisticUpdate = <
	TOptions extends UseTRPCMutationOptions<any, any, any, any>,
	TKey extends TQuery = TQuery,
>(
	ctx: TRPCContextState<AppRouter, NextPageContext>,
	queryKey: [TKey, InferQueryInput<TKey>] | [TKey],
): IOptimisticUpdate<TOptions> => ({
	onMutate: async (updatedData) => {
		await ctx.cancelQuery(queryKey);
		const previousData = ctx.getQueryData(queryKey);

		ctx.setQueryData(queryKey, (prevData: any) =>
			prevData?.map((data: any) =>
				data.id === updatedData.id
					? {
							...data,
							...updatedData,
					  }
					: data,
			),
		);

		return { previousData };
	},
	...optimisticUpdates(ctx, queryKey),
});
export const optimisticDelete = <
	TIds extends Array<string> | Record<PropertyKey, boolean>,
	TOptions extends UseTRPCMutationOptions<any, any, any, any>,
	TKey extends TQuery = TQuery,
>(
	ctx: TRPCContextState<AppRouter, NextPageContext>,
	queryKey: [TKey, InferQueryInput<TKey>] | [TKey],
	setSelectedIds: (ids: TIds) => void,
): IOptimisticUpdate<TOptions> => ({
	onMutate: async ({ ids }) => {
		await ctx.cancelQuery(queryKey);
		const previousData = ctx.getQueryData(queryKey);
		ctx.setQueryData(queryKey, (prevData: any) =>
			prevData?.filter((data: any) => !ids.includes(data.id)),
		);

		setSelectedIds(!Array.isArray(ids) ? {} : ([] as any));

		return { previousData };
	},
	...optimisticUpdates(ctx, queryKey, (ids) => setSelectedIds(ids)),
});

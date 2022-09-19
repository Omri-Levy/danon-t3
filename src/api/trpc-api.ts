import { TRPCContextState } from '@trpc/react/dist/internals/context';
import { AppRouter } from '../server/trpc/router';
import { NextPageContext } from 'next';
import { trpc } from '../utils/trpc';

export abstract class TrpcApi {
	private ctx: TRPCContextState<AppRouter, NextPageContext>;

	constructor() {
		this.ctx = trpc.useContext();
	}
}

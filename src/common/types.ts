import type { TAppRouter } from '../trpc/app-router';
import type { GetInferenceHelpers } from '@trpc/server';
import type { FunctionComponent, PropsWithChildren } from 'react';
import { z } from 'zod';
import { idSchema, idsSchema } from './validation';

/**
 * tRPC
 */
export type TAppRouterTypes = GetInferenceHelpers<TAppRouter>;

/**
 * Products
 */
export type TProductGetAll = TAppRouterTypes['products']['getAll'];
export type TProductGetAllInput = TProductGetAll['input'];
export type TProductGetAllOutput = TProductGetAll['output'];
export type TProductGetById = TAppRouterTypes['products']['getById'];
export type TProductGetByIdInput = TProductGetById['input'];
export type TProductGetByIdOutput = TProductGetById['output'];
export type TProductCreate = TAppRouterTypes['products']['create'];
export type TProductCreateInput = TProductCreate['input'];
export type TProductCreateOutput = TProductCreate['output'];
export type TProductUpdateById =
	TAppRouterTypes['products']['updateById'];
export type TProductUpdateByIdInput = TProductUpdateById['input'];
export type TProductUpdateByIdOutput = TProductUpdateById['output'];
export type TProductDeleteByIds =
	TAppRouterTypes['products']['deleteByIds'];
export type TProductDeleteByIdsInput = TProductDeleteByIds['input'];
export type TProductDeleteByIdsOutput = TProductDeleteByIds['output'];

/**
 * Suppliers
 */
export type TSupplierGetAll = TAppRouterTypes['suppliers']['getAll'];
export type TSupplierGetAllInput = TSupplierGetAll['input'];
export type TSupplierGetAllOutput = TSupplierGetAll['output'];
export type TSupplierGetById =
	TAppRouterTypes['suppliers']['getById'];
export type TSupplierGetByIdInput = TSupplierGetById['input'];
export type TSupplierGetByIdOutput = TSupplierGetById['output'];
export type TSupplierCreate = TAppRouterTypes['suppliers']['create'];
export type TSupplierCreateInput = TSupplierCreate['input'];
export type TSupplierCreateOutput = TSupplierCreate['output'];
export type TSupplierUpdateById =
	TAppRouterTypes['suppliers']['updateById'];
export type TSupplierUpdateByIdInput = TSupplierUpdateById['input'];
export type TSupplierUpdateByIdOutput = TSupplierUpdateById['output'];
export type TSupplierDeleteByIds =
	TAppRouterTypes['suppliers']['deleteByIds'];
export type TSupplierDeleteByIdsInput = TSupplierDeleteByIds['input'];
export type TSupplierDeleteByIdsOutput =
	TSupplierDeleteByIds['output'];

/**
 * Orders
 */
export type TOrderGetAll = TAppRouterTypes['orders']['getAll'];
export type TOrderGetAllInput = TOrderGetAll['input'];
export type TOrderGetAllOutput = TOrderGetAll['output'];
export type TOrderGetById = TAppRouterTypes['orders']['getById'];
export type TOrderGetByIdInput = TOrderGetById['input'];
export type TOrderGetByIdOutput = TOrderGetById['output'];
export type TOrderCreate = TAppRouterTypes['orders']['create'];
export type TOrderCreateInput = TOrderCreate['input'];
export type TOrderCreateOutput = TOrderCreate['output'];
export type TOrderDeleteByIds =
	TAppRouterTypes['orders']['deleteByIds'];
export type TOrderDeleteByIdsInput = TOrderDeleteByIds['input'];
export type TOrderDeleteByIdsOutput = TOrderDeleteByIds['output'];
export type TOrderSend = TAppRouterTypes['orders']['send'];
export type TOrderSendInput = TOrderSend['input'];
export type TOrderSendOutput = TOrderSend['output'];
export type TOrderGetPresignedUrlById =
	TAppRouterTypes['orders']['getPresignedUrlById'];
export type TOrderGetPresignedUrlByIdInput =
	TOrderGetPresignedUrlById['input'];
export type TOrderGetPresignedUrlByIdOutput =
	TOrderGetPresignedUrlById['output'];

/** */

export type TComponentWithChildren<P = Record<any, any>> =
	FunctionComponent<PropsWithChildren<P>>;

export type TAnyArray = Array<any>;
export type TIdSchema = z.infer<typeof idSchema>;
export type TIdsSchema = z.infer<typeof idsSchema>;

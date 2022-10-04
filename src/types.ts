import { AppRouter } from './server';
import { GetInferenceHelpers } from '@trpc/server/dist';
import { FunctionComponent } from 'react';
import { WithChildren } from './interfaces';

/**
 * tRPC
 */
export type AppRouterTypes = GetInferenceHelpers<AppRouter>;

/**
 * Products
 */
export type ProductGetAll = AppRouterTypes['products']['getAll'];
export type ProductGetAllInput = ProductGetAll['input'];
export type ProductGetAllOutput = ProductGetAll['output'];
export type ProductGetById = AppRouterTypes['products']['getById'];
export type ProductGetByIdInput = ProductGetById['input'];
export type ProductGetByIdOutput = ProductGetById['output'];
export type ProductCreate = AppRouterTypes['products']['create'];
export type ProductCreateInput = ProductCreate['input'];
export type ProductCreateOutput = ProductCreate['output'];
export type ProductUpdateById =
	AppRouterTypes['products']['updateById'];
export type ProductUpdateByIdInput = ProductUpdateById['input'];
export type ProductUpdateByIdOutput = ProductUpdateById['output'];
export type ProductDeleteByIds =
	AppRouterTypes['products']['deleteByIds'];
export type ProductDeleteByIdsInput = ProductDeleteByIds['input'];
export type ProductDeleteByIdsOutput = ProductDeleteByIds['output'];

/**
 * Suppliers
 */
export type SupplierGetAll = AppRouterTypes['suppliers']['getAll'];
export type SupplierGetAllInput = SupplierGetAll['input'];
export type SupplierGetAllOutput = SupplierGetAll['output'];
export type SupplierGetById = AppRouterTypes['suppliers']['getById'];
export type SupplierGetByIdInput = SupplierGetById['input'];
export type SupplierGetByIdOutput = SupplierGetById['output'];
export type SupplierCreate = AppRouterTypes['suppliers']['create'];
export type SupplierCreateInput = SupplierCreate['input'];
export type SupplierCreateOutput = SupplierCreate['output'];
export type SupplierUpdateById =
	AppRouterTypes['suppliers']['updateById'];
export type SupplierUpdateByIdInput = SupplierUpdateById['input'];
export type SupplierUpdateByIdOutput = SupplierUpdateById['output'];
export type SupplierDeleteByIds =
	AppRouterTypes['suppliers']['deleteByIds'];
export type SupplierDeleteByIdsInput = SupplierDeleteByIds['input'];
export type SupplierDeleteByIdsOutput = SupplierDeleteByIds['output'];

/**
 * Orders
 */
export type OrderGetAll = AppRouterTypes['orders']['getAll'];
export type OrderGetAllInput = OrderGetAll['input'];
export type OrderGetAllOutput = OrderGetAll['output'];
export type OrderGetById = AppRouterTypes['orders']['getById'];
export type OrderGetByIdInput = OrderGetById['input'];
export type OrderGetByIdOutput = OrderGetById['output'];
export type OrderCreate = AppRouterTypes['orders']['create'];
export type OrderCreateInput = OrderCreate['input'];
export type OrderCreateOutput = OrderCreate['output'];
export type OrderDeleteByIds =
	AppRouterTypes['orders']['deleteByIds'];
export type OrderDeleteByIdsInput = OrderDeleteByIds['input'];
export type OrderDeleteByIdsOutput = OrderDeleteByIds['output'];
export type OrderSend = AppRouterTypes['orders']['send'];
export type OrderSendInput = OrderSend['input'];
export type OrderSendOutput = OrderSend['output'];
export type OrderGetPresignedUrlById =
	AppRouterTypes['orders']['getPresignedUrlById'];
export type OrderGetPresignedUrlByIdInput =
	OrderGetPresignedUrlById['input'];
export type OrderGetPresignedUrlByIdOutput =
	OrderGetPresignedUrlById['output'];

/** */

export type ComponentWithChildren<P = Record<any, any>> =
	FunctionComponent<P & WithChildren>;

export type AnyArray = Array<any>;

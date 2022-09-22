import { z } from 'zod';
import {
	createSupplierSchema,
	supplierIdForeignSchema,
	supplierIdSchema,
	supplierIdsSchema,
	updateSupplierSchema,
} from './validation';
import { Supplier } from '@prisma/client';

export type TSupplierIdSchema = z.infer<typeof supplierIdSchema>;
export type TSupplierIdsSchema = z.infer<typeof supplierIdsSchema>;
export type TSupplierId = Supplier['id'];
export type TSupplierIds = Array<TSupplierId>;
export type TCreateSupplierSchema = z.infer<
	typeof createSupplierSchema
>;
export type TUpdateSupplierSchema = z.infer<
	typeof updateSupplierSchema
>;
export type TSupplierIdForeignSchema = z.infer<
	typeof supplierIdForeignSchema
>;

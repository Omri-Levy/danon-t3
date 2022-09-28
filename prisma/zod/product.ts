import * as z from "zod"
import * as imports from "../../src/translations"
import { Decimal } from "decimal.js"
import { Unit } from "@prisma/client"
import { CompleteSupplier, relatedSupplierSchema, CompleteOrder, relatedOrderSchema } from "./index"

// Helper schema for Decimal fields
z
  .instanceof(Decimal)
  .or(z.string())
  .or(z.number())
  .refine((value) => {
    try {
      return new Decimal(value)
    } catch (error) {
      return false
    }
  })
  .transform((value) => new Decimal(value))

export const productSchema = z.object({
  sku: z.string().max(10, { message: imports.locale.he.validation.product.sku.max }).min(1, { message: imports.locale.he.validation.product.sku.min }),
  name: z.string().max(120, { message: imports.locale.he.validation.product.name.max }).min(1, { message: imports.locale.he.validation.product.name.min }),
  packageSize: z.number().max(1000, { message: imports.locale.he.validation.product.packageSize.max }),
  unit: z.nativeEnum(Unit),
  orderAmount: z.number().max(1000, { message: imports.locale.he.validation.product.orderAmount.max }).min(0, { message: imports.locale.he.validation.product.orderAmount.min }),
  stock: z.number().max(1000, { message: imports.locale.he.validation.product.stock.max }).min(0, { message: imports.locale.he.validation.product.stock.min }),
  supplierId: z.string(),
  orderId: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteProduct extends z.infer<typeof productSchema> {
  supplier: CompleteSupplier
  order?: CompleteOrder | null
}

/**
 * relatedProductSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedProductSchema: z.ZodSchema<CompleteProduct> = z.lazy(() => productSchema.extend({
  supplier: relatedSupplierSchema,
  order: relatedOrderSchema.nullish(),
}))

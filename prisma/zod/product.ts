import * as z from "zod"
import * as imports from "../null"
import { Decimal } from "decimal.js"
import { Unit } from "@prisma/client"
import { CompleteSupplier, RelatedSupplierModel, CompleteOrder, RelatedOrderModel } from "./index"

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

export const ProductModel = z.object({
  sku: z.string().max(10, { message: "SKU must contain at most 10 character(s)" }),
  name: z.string().max(120, { message: "Product name must contain at most 120 character(s)" }),
  packageSize: z.number().max(1000, { message: "Package size must be lower or equal to 1000" }),
  unit: z.nativeEnum(Unit),
  orderAmount: z.number().max(1000, { message: "Order amount must be lower or equal to 1000" }),
  stock: z.number().max(1000, { message: "Stock amount must be lower or equal to 1000" }),
  supplierId: z.string(),
  orderId: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteProduct extends z.infer<typeof ProductModel> {
  supplier: CompleteSupplier
  order?: CompleteOrder | null
}

/**
 * RelatedProductModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedProductModel: z.ZodSchema<CompleteProduct> = z.lazy(() => ProductModel.extend({
  supplier: RelatedSupplierModel,
  order: RelatedOrderModel.nullish(),
}))

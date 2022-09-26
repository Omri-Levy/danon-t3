import * as z from "zod"
import * as imports from "../../src/translations"

export const verificationTokenSchema = z.object({
  identifier: z.string(),
  token: z.string(),
  expires: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

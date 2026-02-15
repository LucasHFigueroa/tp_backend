import { z } from "zod"

const productValidate = z.object({
  name: z.string().min(4),
  price: z.number(),
  stock: z.number(),
  description: z.string(),
  category: z.string()
})

const productPartialValidate = productValidate.partial()

export { productValidate, productPartialValidate }
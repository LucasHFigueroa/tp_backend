import { z } from "zod"

const productValidate = z.object({
  name: z.string().min(4, "El nombre debe tener al menos 4 caracteres"),
  price: z.number().nonnegative("El precio debe ser un número positivo o cero"),
  stock: z.number().int("El stock debe ser un número entero").nonnegative("El stock debe ser un número positivo o cero"),
  description: z.string().min(1, "La descripción no puede estar vacía"),
  category: z.string().min(1, "La categoría no puede estar vacía")
})

const productPartialValidate = productValidate.partial()

export { productValidate, productPartialValidate }
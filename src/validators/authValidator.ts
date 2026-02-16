import { z } from "zod"

const authValidate = z.object({
  email: z.string().email("El formato del email es inválido").endsWith(".com", "El email debe terminar en .com"),
  password: z.string().min(4, "La contraseña debe tener al menos 4 caracteres")
})

export { authValidate }
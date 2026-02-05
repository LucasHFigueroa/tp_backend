import { Router } from "express"
import { register, login } from "../controllers/auth.controller.js"

const authRouter = Router()

// petición de registrar usuario
authRouter.post("/register", register)

// petición de logear usuario
authRouter.post("/login", login)

export { authRouter }
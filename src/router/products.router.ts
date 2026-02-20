import { Router } from "express"
import { getProducts, createProduct, updateProduct, deleteProduct } from "../controllers/products.controller"
import { authMiddleware } from "../middleware/auth.middleware"

const productRouter = Router()

// 1. RUTAS PÚBLICAS (Se ponen ANTES del middleware)
productRouter.get("/", getProducts)


productRouter.use(authMiddleware)

// http://localhost:3000

// 3. RUTAS PRIVADAS (Solo el administrador)
productRouter.post("/", createProduct)
productRouter.patch("/:id", updateProduct)
productRouter.delete("/:id", deleteProduct)

export { productRouter }
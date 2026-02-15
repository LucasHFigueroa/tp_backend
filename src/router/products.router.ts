import { Router } from "express"
import { getProducts, createProduct, updateProduct, deleteProduct } from "../controllers/products.controller"
import { authMiddleware } from "../middleware/auth.middleware"

const productRouter = Router()

productRouter.use(authMiddleware)

// http://localhost:3000

productRouter.get("/", getProducts)
productRouter.post("/", createProduct)
productRouter.patch("/:id", updateProduct)
productRouter.delete("/:id", deleteProduct)

export { productRouter }
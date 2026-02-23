import { Router } from "express"
import { getProducts, createProduct, updateProduct, deleteProduct } from "../controllers/products.controller"
import { authMiddleware } from "../middleware/auth.middleware"

const productRouter = Router()

productRouter.get("/", getProducts)

productRouter.use(authMiddleware)

productRouter.post("/", createProduct)
productRouter.patch("/:id", updateProduct)
productRouter.delete("/:id", deleteProduct)

export { productRouter }
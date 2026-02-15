import express from "express"
import cors from "cors"
import { connectDb } from "./config/mongoDB"
import dotenv from "dotenv"
import { productRouter } from "./router/products.router"
import { authRouter  } from "./router/auth.router"
import { authMiddleware } from "./middleware/auth.middleware"
import { errorHandler } from "./middleware/error.middleware"
import { IPayload } from "./interfaces/IPayload"

dotenv.config()

const serverHTTP = express()

serverHTTP.use(cors())
serverHTTP.use(express.json())

serverHTTP.use("/products", authMiddleware, productRouter)
serverHTTP.use("/auth", authRouter)
serverHTTP.use((req, res) => {
  res.status(404).json({ success: false, error: "El recurso no se encuentra"})
})

serverHTTP.use(errorHandler)

const PORT = process.env.PORT

serverHTTP.listen(PORT, () => {
  try {
    console.log(`✅ Servidor http en escucha en el puerto http://127.0.0.1:${PORT}`)
    connectDb()
  } catch (error) {
    const err = error as Error
    console.log(err.message)
    process.exit(1)
  }
})



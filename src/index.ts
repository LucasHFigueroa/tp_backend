import express from "express"
import cors from "cors"
import { connectDb } from "./config/mongoDB"
import dotenv from "dotenv"
import { productRouter } from "./router/products.router"
import { authRouter  } from "./router/auth.router"
import { errorHandler } from "./middleware/error.middleware"

dotenv.config()

const serverHTTP = express()

serverHTTP.use(cors())
serverHTTP.use(express.json())

// Rutas
serverHTTP.use("/products", productRouter)
serverHTTP.use("/auth", authRouter)

//404 Handler
serverHTTP.use((req, res) => {
  res.status(404).json({ success: false, error: "El recurso no se encuentra"})
})

serverHTTP.use(errorHandler)

const PORT = process.env.PORT

serverHTTP.listen(PORT, () => {
  console.log(`✅ Servidor http en escucha en el puerto http://127.0.0.1:${PORT}`)
  connectDb()
})



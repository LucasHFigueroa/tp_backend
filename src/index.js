import express from "express"
import cors from "cors"
import { connectDb } from "./config/mongoDB.js"
import "dotenv/config"
import { productRouter } from "./router/products.router.js"
import { authRouter  } from "./router/auth.router.js"
import { authMiddleware } from "./middleware/auth.middleware.js"
import { errorHandler } from "./middleware/error.middleware.js"


const serverHTTP = express()

serverHTTP.use(cors())
serverHTTP.use(express.json())

serverHTTP.use("/products", authMiddleware, productRouter)
serverHTTP.use("/auth", authRouter)

serverHTTP.use(errorHandler)

const PORT = process.env.PORT

const startServer = async () => {
  await connectDb()
  
  serverHTTP.listen(PORT, () => {
    console.log(`✅ Servidor http en escucha en el puerto http://127.0.0.1:${PORT}`)
  })
}

startServer()

serverHTTP.get("/", (req, res) => {
  res.json({ message: "API funcionando" });
});




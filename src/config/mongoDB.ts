import { connect } from "mongoose"
import dotenv from "dotenv"

dotenv.config()

const URI = process.env.URI_DB;

if (!URI) {
  throw new Error("Debes ingresar una URI válida")
}

const connectDb = async () => {
  try {
    await connect(URI);
    console.log("✅ Conectado con éxito a MongoDB")
  } catch (error) {
    console.error("❌ No se pudo conectar con la base de datos")
    process.exit(1)
  }
}

export { connectDb }
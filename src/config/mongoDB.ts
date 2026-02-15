import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

const URI = process.env.URI_DB;
const uri = "mongodb+srv://admin:prueba1234@cluster0.mchvyiz.mongodb.net/?appName=Cluster0"

if (!URI) {
  throw new Error("Debes ingresar una URI válida")
}

const connectDb = async () => {
  try {
    await mongoose.connect(uri);
    console.log("✅ Conectado con éxito a MongoDB")
  } catch (error) {
    console.error("❌ No se pudo conectar con la base de datos")
  }
}

export { connectDb }
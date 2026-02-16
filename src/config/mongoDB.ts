import mongoose from "mongoose"

const connectDb = async () => {
  try {
    const URI = process.env.URI_DB;
    if (!URI) {
        throw new Error("La variable de entorno URI_DB no está definida")
    }
    await mongoose.connect(URI);
    console.log("✅ Conectado con éxito a MongoDB")
  } catch (error) {
    console.error("❌ No se pudo conectar con la base de datos", error)
    process.exit(1) // Detiene la app si no hay base de datos
  }
}

export { connectDb }
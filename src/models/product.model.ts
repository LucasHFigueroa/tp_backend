import mongoose from "mongoose"

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true, default: 0, min: 0 },
    stock: { type: Number, required: true, default: 0, min: 0 },
    description: { type: String, default: "Sin descripción" },
    category: { type: String, default: "Sin categoría" },
    image: { type: String, default: "" },   // URL de imagen (jpg, png, webp)
    video: { type: String, default: "" },   // URL de gif/video corto
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

const Product = mongoose.model("Product", productSchema)

export { Product }
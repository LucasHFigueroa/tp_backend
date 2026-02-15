import mongoose from "mongoose"

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, default: 0 },
    stock: { type: Number, default:0 },
    description: {type: String, default: "Sin descripción"},
    category: {type: String, default: "Sin categoría"},

    user: { type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  }, {
    versionKey: false
  }  
)

const Product  = mongoose.model("Product", productSchema)

export { Product }
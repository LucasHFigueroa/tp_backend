import { Schema, model } from "mongoose"

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true, default: "Nuevo usuario" }
}, { versionKey: false }
)

const User = model("User", userSchema)

export { User }
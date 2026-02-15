import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { versionKey: false }
)

const User = mongoose.model("User", UserSchema)

export { User }
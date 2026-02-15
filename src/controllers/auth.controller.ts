import { User } from "../models/user.model"
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { Request, Response } from "express"
import { IPayload } from "../interfaces/IPayload"

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES = process.env.JWT_EXPIRES

const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email o contraseña inválidos"
      })
    }
    if (!email.includes("@") || !email.endsWith(".com")) {
      return res.status(400).json({
        success: false,
        error: "El correo electrónico es inválido"
      })
    }
    if (password.length < 4) {
      return res.status(400).json({
        success: false,
        error: "La constraseña debe contar al menos con 4 caracteres "
      })
    }

    // Hashear la constraseña
    const hashPassword = await bcryptjs.hash(password, 10)

    const newUser = await User.create({
      email,
      password: hashPassword
    })

    // Respuesta (NO se devuelve el password)

    res.status(201).json({
      success: true,
      data: {
        _id: newUser._id,
        email: newUser.email
      }
    })
  } catch (error) {
    const err = error as any
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        error: "El email ya existe en nuestra base de datos"
      })
    }
    res.status(500).json({
      success: false,
      error: err.message
    })
  }
}

const login = async (req: Request, res: Response) => {
  try {
    const { email, password, } = req.body

    if (!email || !password) {
      return res.status(400).json ({
      success: false,
      error: "Debe ingresar email y password"
      })
    }

    const foundUser = await User.findOne({ email })

    if (!foundUser) {
      return res.status(401).json({
        success: false,
        error: "No autorizado"
      })
    }

    const isValidPassword = await bcryptjs.compare(
      password,
      foundUser.password
    )

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: "No autorizado"
      })
    }

    if (!JWT_SECRET) {
      return res.status(500).json({
        success: false,
        error: "Error de configuración del servidor"
      })
    }

    const payload: IPayload = { _id: foundUser._id, email: foundUser.email }

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" })
    res.json({
      success: true,
      data: token
    })
  } catch (error) {
    const err = error as Error
    res.status(500).json({
      success: false,
      error: err.message
    })
  }
}

export { register, login }
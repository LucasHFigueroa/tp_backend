import { User } from "../models/user.model"
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import { Request, Response } from "express"
import { IPayload } from "../interfaces/IPayload"
import { authValidate } from "../validators/authValidator"

const JWT_SECRET = process.env.JWT_SECRET

const register = async (req: Request, res: Response) => {
  try {
    const validation = authValidate.safeParse(req.body)

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: validation.error.flatten().fieldErrors
      })
    }

    const { email, password } = validation.data

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
    const validation = authValidate.safeParse(req.body)

    if (!validation.success) {
        return res.status(400).json({
          success: false,
          error: validation.error.flatten().fieldErrors
        })
    }

    const { email, password } = validation.data

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
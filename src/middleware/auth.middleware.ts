import jwt from "jsonwebtoken"
import { NextFunction, Request, Response } from "express"
import { IPayload } from "../interfaces/IPayload"
import dotenv from "dotenv"

dotenv.config()

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization

  const JWT_SECRET = process.env.JWT_SECRET

  if (!JWT_SECRET) {
    return res.status(500).json({
      success: false,
      error: "Error de configuración del servidor"
    })
  }

  if (!header) {
    return res.status(401).json({
      success: false,
      error: "Token requerido"
    })
  } 

  if (!header.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      error: "Formato inválido. Use Bearer TOKEN"
    })
  }
  const token = header.split(" ")[1]

  if (!token) {
    return res.status(401).json({ success: false, error: "token inválido"})
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as IPayload
    req.user = payload
    next()
  } catch (error) {
    const err = error as Error
    res.status(500).json({ success: false, error: err.message })
  }
}

export { authMiddleware }
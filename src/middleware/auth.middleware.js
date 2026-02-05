import jwt from "jsonwebtoken"

const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization

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

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: "Token inválido o expirado"
    })
  }
}

export { authMiddleware }
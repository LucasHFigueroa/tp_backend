import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AuthContext = createContext(null)

function getPayload(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser]   = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('noctis_token'))
  const [loading, setLoading] = useState(false)

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('noctis_token')
  }, [])

  useEffect(() => {
    if (!token) { setUser(null); return }

    const payload = getPayload(token)
    if (!payload) { logout(); return }

    // Verificar expiración al montar
    const now = Math.floor(Date.now() / 1000)
    if (payload.exp && payload.exp < now) { logout(); return }

    setUser({ email: payload.email, _id: payload._id })

    // Programar logout automático cuando expire el token
    if (payload.exp) {
      const msUntilExpiry = (payload.exp - now) * 1000
      const timer = setTimeout(() => { logout() }, msUntilExpiry)
      return () => clearTimeout(timer)
    }
  }, [token, logout])

  const login = async (email, password) => {
    setLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error || 'Error al iniciar sesión')
      localStorage.setItem('noctis_token', data.data)
      setToken(data.data)
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  const register = async (email, password) => {
    setLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (!data.success) throw new Error(
        typeof data.error === 'object'
          ? Object.values(data.error).flat().join('. ')
          : data.error
      )
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
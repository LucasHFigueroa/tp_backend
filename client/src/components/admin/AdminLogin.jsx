import { useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import './AdminLogin.css'

export default function AdminLogin() {
  const { login, register, loading } = useAuth()
  const [mode, setMode]         = useState('login')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState(null)
  const [success, setSuccess]   = useState(null)

  const isLogin = mode === 'login'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (isLogin) {
      const result = await login(email, password)
      if (!result.success) setError(result.error)
    } else {
      const result = await register(email, password)
      if (!result.success) {
        setError(result.error)
      } else {
        setSuccess('Usuario registrado. Ahora podés iniciar sesión.')
        setMode('login')
        setPassword('')
      }
    }
  }

  return (
    <div className="admin-login">
      <div className="admin-login__card">

        <div className="admin-login__header">
          <h2 className="admin-login__title">
            {isLogin ? 'ACCESO ADMIN' : 'REGISTRO'}
          </h2>
          <p className="admin-login__subtitle">
            {isLogin ? 'Solo personal autorizado' : 'Crear cuenta de administrador'}
          </p>
        </div>

        <div className="admin-login__topline" />

        <form className="admin-login__form" onSubmit={handleSubmit}>
          <div className="admin-login__field">
            <label className="admin-login__label">EMAIL</label>
            <input
              className="admin-login__input"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@noctis.com"
              required
            />
          </div>

          <div className="admin-login__field">
            <label className="admin-login__label">CONTRASEÑA</label>
            <input
              className="admin-login__input"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="admin-login__error">⚠️ {error}</div>
          )}

          {success && (
            <div className="admin-login__success">✓ {success}</div>
          )}

          <button className="admin-login__btn" type="submit" disabled={loading}>
            {loading
              ? (isLogin ? 'INGRESANDO...' : 'REGISTRANDO...')
              : (isLogin ? 'INGRESAR' : 'REGISTRARSE')
            }
          </button>

          <button
            type="button"
            className="admin-login__toggle"
            onClick={() => { setMode(isLogin ? 'register' : 'login'); setError(null); setSuccess(null) }}
          >
            {isLogin ? '¿No tenés cuenta? Registrate' : '¿Ya tenés cuenta? Iniciá sesión'}
          </button>
        </form>

      </div>
    </div>
  )
}
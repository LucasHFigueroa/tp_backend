import { useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import './AdminLogin.css'

export default function AdminLogin() {
  const { login, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    const result = await login(email, password)
    if (!result.success) setError(result.error)
  }

  return (
    <div className="admin-login">
      <div className="admin-login__card">

        <div className="admin-login__header">
          <h2 className="admin-login__title">ACCESO ADMIN</h2>
          <p className="admin-login__subtitle">Solo personal autorizado</p>
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
              placeholder="admin@noctua.com"
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
            <div className="admin-login__error">
              ⚠️ {error}
            </div>
          )}

          <button
            className="admin-login__btn"
            type="submit"
            disabled={loading}
          >
            {loading ? 'INGRESANDO...' : 'INGRESAR'}
          </button>
        </form>

      </div>
    </div>
  )
}
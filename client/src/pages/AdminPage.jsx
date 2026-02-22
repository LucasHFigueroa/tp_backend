import { useAuth } from '../context/AuthContext.jsx'
import AdminLogin from '../components/admin/AdminLogin.jsx'
import AdminDashboard from '../components/admin/AdminDashboard.jsx'
import './AdminPage.css'

export default function AdminPage({ onNavigateMenu }) {
  const { user, logout } = useAuth()

  return (
    <div className="admin-page">

      <header className="admin-page__header">
        <button className="admin-page__back" onClick={onNavigateMenu}>
          ← MENÚ
        </button>

        <h1 className="admin-page__logo">NOCTIS ADMIN</h1>

        {user && (
          <div className="admin-page__user">
            <span className="admin-page__email">{user.email}</span>
            <button className="admin-page__logout" onClick={logout}>
              SALIR
            </button>
          </div>
        )}

        {!user && <div style={{ width: 120 }} />}
      </header>

      <div className="admin-page__topline" />

      <main className="admin-page__main">
        {user ? <AdminDashboard /> : <AdminLogin />}
      </main>

    </div>
  )
}
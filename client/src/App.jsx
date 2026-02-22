import { useState } from 'react'
import { AuthProvider } from './context/AuthContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import MenuPage from './pages/MenuPage.jsx'
import AdminPage from './pages/AdminPage.jsx'

function App() {
  const [currentPage, setCurrentPage] = useState('menu')
  const [menuKey, setMenuKey] = useState(0)

  const navigate = (page) => {
    setCurrentPage(page)
    const root = document.getElementById('root')
    if (page === 'admin') {
      root.classList.add('admin-mode')
    } else {
      // Al volver al menú incrementamos la key → fuerza remount → refetch
      setMenuKey(prev => prev + 1)
      root.classList.remove('admin-mode')
    }
  }

  return (
    <AuthProvider>
      <CartProvider>
        {currentPage === 'menu' && (
          <MenuPage
            key={menuKey}
            onNavigateAdmin={() => navigate('admin')}
          />
        )}
        {currentPage === 'admin' && (
          <AdminPage onNavigateMenu={() => navigate('menu')} />
        )}
      </CartProvider>
    </AuthProvider>
  )
}

export default App
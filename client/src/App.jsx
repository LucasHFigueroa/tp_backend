import { useState } from 'react'
import { AuthProvider } from './context/AuthContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import MenuPage from './pages/MenuPage.jsx'
import AdminPage from './pages/AdminPage.jsx'

function App() {
  const [currentPage, setCurrentPage] = useState('menu')

  const navigate = (page) => {
    setCurrentPage(page)
    const root = document.getElementById('root')
    if (page === 'admin') {
      root.classList.add('admin-mode')
    } else {
      root.classList.remove('admin-mode')
    }
  }

  return (
    <AuthProvider>
      <CartProvider>
        {currentPage === 'menu' && (
          <MenuPage onNavigateAdmin={() => navigate('admin')} />
        )}
        {currentPage === 'admin' && (
          <AdminPage onNavigateMenu={() => navigate('menu')} />
        )}
      </CartProvider>
    </AuthProvider>
  )
}

export default App
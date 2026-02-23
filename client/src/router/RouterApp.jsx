import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { CartProvider } from '../context/CartContext.jsx'
import MenuPage from '../pages/MenuPage.jsx'
import AdminPage from '../pages/AdminPage.jsx'

export function RouterApp() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route path="/"      element={<MenuPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*"      element={<Navigate to="/" replace />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  )
}
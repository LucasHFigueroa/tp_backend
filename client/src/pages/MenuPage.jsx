import { useState } from 'react'
import { useProducts } from '../hooks/useProducts.js'
import { useCart } from '../context/CartContext.jsx'
import Header from '../components/layout/Header.jsx'
import MenuFeed from '../components/menu/MenuFeed.jsx'
import CartDrawer from '../components/cart/CartDrawer.jsx'
import TinderMode from '../components/tinder/TinderMode.jsx'
import './MenuPage.css'

export default function MenuPage({ onNavigateAdmin }) {
  const { products, loading, error } = useProducts()
  const { totalItems, setIsOpen } = useCart()
  const [tinderOpen, setTinderOpen] = useState(false)

  return (
    <div className="menu-page">

      <Header />

      <main className="menu-page__main">

        {loading && (
          <div className="menu-page__loading">
            <div className="menu-page__spinner" />
            <p>cargando carta...</p>
          </div>
        )}

        {error && (
          <div className="menu-page__error">
            <span>⚠️</span>
            <p>No se pudo cargar la carta. ¿El servidor está corriendo?</p>
          </div>
        )}

        {!loading && !error && (
          <MenuFeed products={products} />
        )}

      </main>

      <footer className="menu-page__footer">
        <button
          className="footer-btn footer-btn--ghost"
          onClick={onNavigateAdmin}
        >
          <span className="footer-btn__icon">⚙</span>
          <span className="footer-btn__label">ADMIN</span>
        </button>

        <button
          className="footer-btn footer-btn--cart"
          onClick={() => setIsOpen(true)}
        >
          <span>PEDIDO</span>
          {totalItems > 0 && (
            <span className="footer-btn__badge">{totalItems}</span>
          )}
        </button>

        <button
          className="footer-btn footer-btn--ghost"
          onClick={() => setTinderOpen(true)}
        >
          <span className="footer-btn__icon">✨</span>
          <span className="footer-btn__label">SORPRESA</span>
        </button>
      </footer>

      <CartDrawer />
      {tinderOpen && (
        <TinderMode
          products={products}
          onClose={() => setTinderOpen(false)}
        />
      )}
    </div>
  )
}
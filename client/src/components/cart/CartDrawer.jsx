import { useState } from 'react'
import { useCart } from '../../context/CartContext.jsx'
import './CartDrawer.css'

export default function CartDrawer() {
  const {
    items, isOpen, setIsOpen,
    addItem, decreaseItem, removeItem,
    clearCart, sendOrder,
    totalItems, totalPrice, orderSent
  } = useCart()

  const [calling, setCalling] = useState(false)
  const [called, setCalled] = useState(false)

  const handleSendOrder = async () => {
    setCalling(true)
    // Simulamos una pequeña espera dramática ✨
    await new Promise(r => setTimeout(r, 1800))
    sendOrder()
    setCalling(false)
    setCalled(true)
  }

  const handleClose = () => {
    setIsOpen(false)
    if (called) {
      setCalled(false)
      clearCart()
    }
  }

  if (!isOpen) return null

  return (
    <>
      <div className="drawer-overlay" onClick={handleClose} />

      <div className="cart-drawer">

        <div className="cart-drawer__handle" />

        <div className="cart-drawer__header">
          <div>
            <h2 className="cart-drawer__title">MI PEDIDO</h2>
            {items.length > 0 && (
              <p className="cart-drawer__subtitle">
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </p>
            )}
          </div>
          <button className="cart-drawer__close" onClick={handleClose}>✕</button>
        </div>

        <div className="cart-drawer__topline" />

        {/* Estado: vacío */}
        {items.length === 0 && !called && (
          <div className="cart-drawer__empty">
            <span className="cart-drawer__empty-icon">🛒</span>
            <p>Tu pedido está vacío</p>
            <span className="cart-drawer__empty-hint">
              Agregá algo desde la carta
            </span>
          </div>
        )}

        {/* Estado: pedido enviado */}
        {called && (
          <div className="cart-drawer__success">
            <div className="cart-drawer__success-icon">🔔</div>
            <h3 className="cart-drawer__success-title">¡Pedido enviado!</h3>
            <p className="cart-drawer__success-msg">
              El mozo ya está en camino.<br />
              En un momento te atendemos.
            </p>
            <button className="cart-drawer__new-order" onClick={handleClose}>
              CERRAR
            </button>
          </div>
        )}

        {/* Lista de items */}
        {items.length > 0 && !called && (
          <>
            <ul className="cart-drawer__list">
              {items.map(item => (
                <li key={item._id} className="cart-item">
                  <div className="cart-item__info">
                    <span className="cart-item__name">{item.name}</span>
                    <span className="cart-item__unit-price">
                      ${item.price.toLocaleString('es-AR')} c/u
                    </span>
                  </div>

                  <div className="cart-item__controls">
                    <button
                      className="cart-item__btn"
                      onClick={() => decreaseItem(item._id)}
                    >
                      −
                    </button>
                    <span className="cart-item__qty">{item.quantity}</span>
                    <button
                      className="cart-item__btn cart-item__btn--add"
                      onClick={() => addItem(item)}
                    >
                      +
                    </button>
                  </div>

                  <div className="cart-item__right">
                    <span className="cart-item__total">
                      ${(item.price * item.quantity).toLocaleString('es-AR')}
                    </span>
                    <button
                      className="cart-item__remove"
                      onClick={() => removeItem(item._id)}
                    >
                      ✕
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            {/* Total */}
            <div className="cart-drawer__bottomline" />
            <div className="cart-drawer__total">
              <span className="cart-drawer__total-label">TOTAL</span>
              <span className="cart-drawer__total-price">
                ${totalPrice.toLocaleString('es-AR')}
              </span>
            </div>

            {/* Botón llamar al mozo */}
            <button
              className={`cart-drawer__cta ${calling ? 'cart-drawer__cta--loading' : ''}`}
              onClick={handleSendOrder}
              disabled={calling}
            >
              {calling ? (
                <span className="cart-drawer__cta-loading">
                  <span className="cart-drawer__dot" />
                  <span className="cart-drawer__dot" />
                  <span className="cart-drawer__dot" />
                </span>
              ) : (
                <>🔔 &nbsp; LLAMAR AL MOZO</>
              )}
            </button>

            <button
              className="cart-drawer__clear"
              onClick={clearCart}
            >
              vaciar pedido
            </button>
          </>
        )}
      </div>
    </>
  )
}
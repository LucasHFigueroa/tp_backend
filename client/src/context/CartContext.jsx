import { createContext, useContext, useState, useReducer } from 'react'

const CartContext = createContext(null)

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i._id === action.payload._id)
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i._id === action.payload._id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          )
        }
      }
      return { ...state, items: [...state.items, { ...action.payload, quantity: 1 }] }
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i._id !== action.payload) }
    case 'DECREASE_ITEM': {
      const existing = state.items.find(i => i._id === action.payload)
      if (existing?.quantity <= 1) {
        return { ...state, items: state.items.filter(i => i._id !== action.payload) }
      }
      return {
        ...state,
        items: state.items.map(i =>
          i._id === action.payload ? { ...i, quantity: i.quantity - 1 } : i
        )
      }
    }
    case 'CLEAR_CART':
      return { items: [], orderSent: false }
    case 'SEND_ORDER':
      return { ...state, orderSent: true }
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], orderSent: false })
  const [isOpen, setIsOpen] = useState(false)

  const addItem    = (product) => dispatch({ type: 'ADD_ITEM',     payload: product })
  const removeItem = (id)      => dispatch({ type: 'REMOVE_ITEM',  payload: id })
  const decreaseItem = (id)    => dispatch({ type: 'DECREASE_ITEM', payload: id })
  const clearCart  = ()        => dispatch({ type: 'CLEAR_CART' })
  const sendOrder  = ()        => dispatch({ type: 'SEND_ORDER' })

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0)
  const totalPrice = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <CartContext.Provider value={{
      items: state.items,
      orderSent: state.orderSent,
      isOpen, setIsOpen,
      addItem, removeItem, decreaseItem, clearCart, sendOrder,
      totalItems, totalPrice
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
import { useState } from 'react'
import { useCart } from '../../context/CartContext.jsx'
import './ProductCard.css'

const CATEGORY_EMOJI = {
  cocktails:     '🍸',
  tragos:        '🍹',
  cervezas:      '🍺',
  cerveza:       '🍺',
  picadas:       '🧀',
  picada:        '🧀',
  vinos:         '🍷',
  vino:          '🍷',
  'sin alcohol': '🫧',
  default:       '✦'
}

function getCategoryEmoji(category = '') {
  const key = category.toLowerCase()
  return CATEGORY_EMOJI[key] || CATEGORY_EMOJI.default
}

export default function ProductCard({ product }) {
  const { addItem, items } = useCart()
  const [added, setAdded] = useState(false)
  const [imgError, setImgError] = useState(false)

  const inCart = items.find(i => i._id === product._id)
  const emoji = getCategoryEmoji(product.category)

  const hasVideo = product.video && product.video.trim() !== ''
  const hasImage = product.image && product.image.trim() !== '' && !imgError

  const handleAdd = () => {
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1200)
  }

  return (
    <article className="product-card">

      <div className="product-card__img">
        {hasVideo ? (
          <img
            src={product.video}
            alt={product.name}
            className="product-card__media"
            onError={() => setImgError(true)}
          />
        ) : hasImage ? (
          <img
            src={product.image}
            alt={product.name}
            className="product-card__media"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="product-card__emoji">{emoji}</span>
        )}
        <div className="product-card__img-overlay" />
        <span className="product-card__category">{product.category}</span>
      </div>

      <div className="product-card__body">
        <h3 className="product-card__name">{product.name}</h3>
        <p className="product-card__desc">{product.description}</p>

        <div className="product-card__footer">
          <span className="product-card__price">
            ${product.price.toLocaleString('es-AR')}
          </span>
          <button
            className={`product-card__btn ${added ? 'product-card__btn--added' : ''}`}
            onClick={handleAdd}
          >
            {added ? '✓ LISTO' : inCart ? `+ (${inCart.quantity})` : '+ AGREGAR'}
          </button>
        </div>
      </div>

    </article>
  )
}
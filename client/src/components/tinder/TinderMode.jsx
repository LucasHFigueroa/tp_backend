import { useState, useEffect } from 'react'
import { useCart } from '../../context/CartContext.jsx'
import { productsApi } from '../../services/api.js'
import './TinderMode.css'

const TAGS = [
  { id: 'party',       label: '🎉 Party' },
  { id: 'refrescante', label: '🫧 Refrescante' },
  { id: 'classy',      label: '✨ Classy' },
  { id: 'picante',     label: '🌶️ Picante' },
  { id: 'social',      label: '👯 Social' },
  { id: 'romantico',   label: '🕯️ Romántico' },
  { id: 'suave',       label: '🌙 Suave' },
  { id: 'todo',        label: '🎲 Sorpréndeme' },
]

const CATEGORY_EMOJI = {
  cocktails:     '🍸',
  tragos:        '🍹',
  cervezas:      '🍺',
  picadas:       '🧀',
  vinos:         '🍷',
  'sin alcohol': '🫧',
  default:       '✦'
}

function getEmoji(cat = '') {
  return CATEGORY_EMOJI[cat.toLowerCase()] || CATEGORY_EMOJI.default
}

function TinderCardMedia({ product }) {
  const [imgError, setImgError] = useState(false)
  const hasImage = product.image && product.image.trim() !== '' && !imgError

  return (
    <div className="tinder-card__media-wrap">
      {hasImage ? (
        <img
          src={product.image}
          alt={product.name}
          className="tinder-card__img"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="tinder-card__emoji-bg">
          <span className="tinder-card__emoji-big">{getEmoji(product.category)}</span>
        </div>
      )}
    </div>
  )
}

export default function TinderMode({ onClose }) {
  const { addItem } = useCart()
  const [selectedTag, setSelectedTag] = useState(null)
  const [deck, setDeck]         = useState([])
  const [current, setCurrent]   = useState(0)
  const [swipeDir, setSwipeDir] = useState(null)
  const [matched, setMatched]   = useState(null)
  const [started, setStarted]   = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const handleStart = async () => {
    setLoading(true)
    setError(null)
    try {
      // Si es 'todo' o no hay tag seleccionado → traer todo sin filtro
      // Si hay tag → GET /products?tags=party (un solo fetch)
      const params = selectedTag && selectedTag !== 'todo'
        ? { tags: selectedTag }
        : {}

      const products = await productsApi.getAll(params)

      if (!products || products.length === 0) {
        setError('No hay productos para ese mood todavía. ¡Asignale tags desde el admin!')
        setLoading(false)
        return
      }

      const shuffled = [...products].sort(() => Math.random() - 0.5)
      setDeck(shuffled)
      setCurrent(0)
      setMatched(null)
      setStarted(true)
    } catch (err) {
      setError('No se pudieron cargar los productos. ¿El servidor está corriendo?')
    } finally {
      setLoading(false)
    }
  }

  const swipe = (dir) => {
    if (swipeDir) return
    setSwipeDir(dir)
    setTimeout(() => {
      if (dir === 'right') {
        setMatched(deck[current])
      } else {
        const next = current + 1
        if (next >= deck.length) {
          setDeck(prev => [...prev].sort(() => Math.random() - 0.5))
          setCurrent(0)
        } else {
          setCurrent(next)
        }
      }
      setSwipeDir(null)
    }, 380)
  }

  const advanceDeck = () => {
    setMatched(null)
    const next = current + 1
    if (next >= deck.length) {
      setDeck(prev => [...prev].sort(() => Math.random() - 0.5))
      setCurrent(0)
    } else {
      setCurrent(next)
    }
  }

  const handleAddToCart = () => { addItem(matched); advanceDeck() }
  const handleSkipMatch  = () => advanceDeck()
  const handleRestart    = () => { setStarted(false); setSelectedTag(null); setMatched(null); setError(null) }

  const card     = deck[current]
  const nextCard = deck[current + 1]

  return (
    <div className="tinder-mode">

      <div className="tinder-mode__header">
        <button className="tinder-mode__back" onClick={onClose}>←</button>
        <h2 className="tinder-mode__title">NO SÉ QUÉ PEDIR</h2>
        <div style={{ width: 80 }} />
      </div>
      <div className="tinder-mode__topline" />

      {/* === SETUP === */}
      {!started && (
        <div className="tinder-mode__setup">
          <p className="tinder-mode__question">¿Cómo te sentís hoy?</p>
          <p className="tinder-mode__hint">Elegí un mood y te recomendamos algo</p>

          <div className="tinder-tags">
            {TAGS.map(tag => (
              <button
                key={tag.id}
                className={`tinder-tag ${selectedTag === tag.id ? 'tinder-tag--active' : ''}`}
                onClick={() => setSelectedTag(prev => prev === tag.id ? null : tag.id)}
              >
                {tag.label}
              </button>
            ))}
          </div>

          {error && (
            <p style={{ color: 'var(--red-vivid)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textAlign: 'center' }}>
              ⚠️ {error}
            </p>
          )}

          <button
            className="tinder-mode__start"
            onClick={handleStart}
            disabled={loading}
          >
            {loading ? 'CARGANDO...' : 'EMPEZAR →'}
          </button>
        </div>
      )}

      {/* === SWIPE === */}
      {started && !matched && card && (
        <div className="tinder-mode__swipe-area">

          {nextCard && (
            <div className="tinder-card tinder-card--back">
              <TinderCardMedia product={nextCard} />
            </div>
          )}

          <div className={`tinder-card tinder-card--front
            ${swipeDir === 'left'  ? 'tinder-card--swipe-left'  : ''}
            ${swipeDir === 'right' ? 'tinder-card--swipe-right' : ''}
          `}>
            <div className={`tinder-card__label tinder-card__label--like ${swipeDir === 'right' ? 'visible' : ''}`}>ME COPA</div>
            <div className={`tinder-card__label tinder-card__label--nope ${swipeDir === 'left'  ? 'visible' : ''}`}>PASO</div>

            <TinderCardMedia product={card} />
            <div className="tinder-card__content">
              <span className="tinder-card__category">{card.category}</span>
              <h3 className="tinder-card__name">{card.name}</h3>
              <p className="tinder-card__desc">{card.description}</p>
              <p className="tinder-card__price">${card.price.toLocaleString('es-AR')}</p>
            </div>
          </div>

          <div className="tinder-mode__actions">
            <button className="tinder-mode__btn tinder-mode__btn--nope"    onClick={() => swipe('left')}>✕</button>
            <button className="tinder-mode__btn tinder-mode__btn--restart" onClick={handleRestart}>↺</button>
            <button className="tinder-mode__btn tinder-mode__btn--like"    onClick={() => swipe('right')}>♥</button>
          </div>

          <p className="tinder-mode__progress">{current + 1} / {deck.length}</p>
        </div>
      )}

      {/* === MATCH === */}
      {matched && (
        <div className="tinder-mode__match">
          <div className="tinder-match__glow" />
          <div className="tinder-match__banner">✦ &nbsp; MATCH &nbsp; ✦</div>

          <div className="tinder-match__card">
            {matched.image ? (
              <img src={matched.image} alt={matched.name} className="tinder-match__img"
                onError={e => e.target.style.display = 'none'} />
            ) : (
              <span className="tinder-match__emoji">{getEmoji(matched.category)}</span>
            )}
            <div className="tinder-match__info">
              <h3 className="tinder-match__name">{matched.name}</h3>
              <p className="tinder-match__price">${matched.price.toLocaleString('es-AR')}</p>
            </div>
          </div>

          <div className="tinder-match__actions">
            <button className="tinder-match__btn tinder-match__btn--add" onClick={handleAddToCart}>
              + AGREGAR AL PEDIDO
            </button>
            <button className="tinder-match__btn tinder-match__btn--skip" onClick={handleSkipMatch}>
              seguir buscando
            </button>
          </div>
        </div>
      )}

      {started && !matched && !card && (
        <div className="tinder-mode__empty">
          <span>🍸</span>
          <p>No hay más productos para ese mood</p>
          <button className="tinder-mode__start" onClick={handleRestart}>VOLVER A ELEGIR</button>
        </div>
      )}
    </div>
  )
}
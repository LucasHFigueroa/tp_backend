import { useState } from 'react'
import { useCart } from '../../context/CartContext.jsx'
import './TinderMode.css'

const TAGS = [
  { id: 'party',       label: '🎉 Party',       match: ['cocktails', 'tragos'] },
  { id: 'refrescante', label: '🫧 Refrescante',  match: ['cervezas', 'sin alcohol'] },
  { id: 'classy',      label: '✨ Classy',       match: ['cocktails', 'vinos'] },
  { id: 'picante',     label: '🌶️ Picante',      match: ['picadas'] },
  { id: 'social',      label: '👯 Social',       match: ['cervezas', 'picadas'] },
  { id: 'romantico',   label: '🕯️ Romántico',    match: ['vinos', 'cocktails'] },
  { id: 'suave',       label: '🌙 Suave',        match: ['sin alcohol', 'vinos'] },
  { id: 'todo',        label: '🎲 Sorpréndeme',  match: [] },
]

const CATEGORY_EMOJI = {
  cocktails: '🍸', tragos: '🍹', cervezas: '🍺',
  picadas: '🧀', vinos: '🍷', 'sin alcohol': '🫧', default: '✦'
}

function getEmoji(cat = '') {
  return CATEGORY_EMOJI[cat.toLowerCase()] || CATEGORY_EMOJI.default
}

function filterByTags(products, selectedTags) {
  if (!selectedTags.length) return products
  if (selectedTags.includes('todo')) return products
  const allowedCategories = new Set()
  selectedTags.forEach(tagId => {
    const tag = TAGS.find(t => t.id === tagId)
    tag?.match.forEach(cat => allowedCategories.add(cat))
  })
  return products.filter(p => allowedCategories.has(p.category?.toLowerCase()))
}

export default function TinderMode({ products, onClose }) {
  const { addItem } = useCart()
  const [selectedTags, setSelectedTags] = useState([])
  const [deck, setDeck] = useState([])
  const [current, setCurrent] = useState(0)
  const [swipeDir, setSwipeDir] = useState(null)
  const [matched, setMatched] = useState(null)
  const [started, setStarted] = useState(false)

  const toggleTag = (tagId) => {
    if (tagId === 'todo') {
      setSelectedTags(prev => prev.includes('todo') ? [] : ['todo'])
      return
    }
    setSelectedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(t => t !== tagId)
        : [...prev.filter(t => t !== 'todo'), tagId]
    )
  }

  const handleStart = () => {
    const filtered = filterByTags(products, selectedTags)
    const shuffled = [...filtered].sort(() => Math.random() - 0.5)
    setDeck(shuffled)
    setCurrent(0)
    setMatched(null)
    setStarted(true)
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
          setDeck([...deck].sort(() => Math.random() - 0.5))
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
      setDeck([...deck].sort(() => Math.random() - 0.5))
      setCurrent(0)
    } else {
      setCurrent(next)
    }
  }

  const handleAddToCart = () => { addItem(matched); advanceDeck() }
  const handleSkipMatch  = () => advanceDeck()
  const handleRestart    = () => { setStarted(false); setSelectedTags([]); setMatched(null) }

  const card = deck[current]
  const nextCard = deck[current + 1]

  return (
    <div className="tinder-mode">

      {/* Header */}
      <div className="tinder-mode__header">
        <button className="tinder-mode__back" onClick={onClose}>← VOLVER</button>
        <h2 className="tinder-mode__title">NO SÉ QUÉ PEDIR</h2>
        <div style={{ width: 80 }} />
      </div>
      <div className="tinder-mode__topline" />

      {/* === SELECCIÓN DE TAGS === */}
      {!started && (
        <div className="tinder-mode__setup">
          <p className="tinder-mode__question">¿Cómo te sentís hoy?</p>
          <p className="tinder-mode__hint">Elegí uno o más filtros, o dejalo al azar</p>

          <div className="tinder-tags">
            {TAGS.map(tag => (
              <button
                key={tag.id}
                className={`tinder-tag ${selectedTags.includes(tag.id) ? 'tinder-tag--active' : ''}`}
                onClick={() => toggleTag(tag.id)}
              >
                {tag.label}
              </button>
            ))}
          </div>

          <button className="tinder-mode__start" onClick={handleStart}>
            EMPEZAR →
          </button>
        </div>
      )}

      {/* === SWIPE === */}
      {started && !matched && card && (
        <div className="tinder-mode__swipe-area">

          {/* Carta de fondo */}
          {nextCard && (
            <div className="tinder-card tinder-card--back">
              <div className="tinder-card__emoji-big">{getEmoji(nextCard.category)}</div>
            </div>
          )}

          {/* Carta principal */}
          <div className={`tinder-card tinder-card--front
            ${swipeDir === 'left'  ? 'tinder-card--swipe-left'  : ''}
            ${swipeDir === 'right' ? 'tinder-card--swipe-right' : ''}
          `}>
            <div className={`tinder-card__label tinder-card__label--like  ${swipeDir === 'right' ? 'visible' : ''}`}>ME COPA</div>
            <div className={`tinder-card__label tinder-card__label--nope  ${swipeDir === 'left'  ? 'visible' : ''}`}>PASO</div>

            <div className="tinder-card__emoji-big">{getEmoji(card.category)}</div>
            <span className="tinder-card__category">{card.category}</span>
            <h3 className="tinder-card__name">{card.name}</h3>
            <p className="tinder-card__desc">{card.description}</p>
            <p className="tinder-card__price">${card.price.toLocaleString('es-AR')}</p>
          </div>

          {/* Botones */}
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
            <span className="tinder-match__emoji">{getEmoji(matched.category)}</span>
            <h3 className="tinder-match__name">{matched.name}</h3>
            <p className="tinder-match__desc">{matched.description}</p>
            <p className="tinder-match__price">${matched.price.toLocaleString('es-AR')}</p>
          </div>

          <div className="tinder-match__actions">
            <button className="tinder-match__btn tinder-match__btn--add"  onClick={handleAddToCart}>
              + AGREGAR AL PEDIDO
            </button>
            <button className="tinder-match__btn tinder-match__btn--skip" onClick={handleSkipMatch}>
              seguir buscando
            </button>
          </div>
        </div>
      )}

      {/* Sin resultados */}
      {started && !matched && !card && (
        <div className="tinder-mode__empty">
          <span>🍸</span>
          <p>No hay productos para esos filtros</p>
          <button className="tinder-mode__start" onClick={handleRestart}>VOLVER A ELEGIR</button>
        </div>
      )}
    </div>
  )
}
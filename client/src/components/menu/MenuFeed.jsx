import ProductCard from './ProductCard.jsx'
import './MenuFeed.css'

const CATEGORY_ORDER = ['Cocktails', 'Tragos', 'Cervezas', 'Vinos', 'Picadas', 'Sin alcohol']

const CATEGORY_CHIPS = [
  { label: '🍸 Cocktails',   id: 'cocktails' },
  { label: '🍹 Tragos',      id: 'tragos' },
  { label: '🍺 Cervezas',    id: 'cervezas' },
  { label: '🍷 Vinos',       id: 'vinos' },
  { label: '🧀 Picadas',     id: 'picadas' },
  { label: '🫧 Sin alcohol', id: 'sin-alcohol' },
]

function groupByCategory(products) {
  const groups = {}
  products.forEach(p => {
    const cat = p.category || 'Otros'
    if (!groups[cat]) groups[cat] = []
    groups[cat].push(p)
  })
  const sorted = {}
  CATEGORY_ORDER.forEach(cat => { if (groups[cat]) sorted[cat] = groups[cat] })
  Object.keys(groups).forEach(cat => { if (!sorted[cat]) sorted[cat] = groups[cat] })
  return sorted
}

function SectionDivider({ title }) {
  return (
    <div className="section-divider">
      <div className="section-divider__line" />
      <h2 className="section-divider__title">{title}</h2>
      <div className="section-divider__line section-divider__line--right" />
    </div>
  )
}

export default function MenuFeed({ products }) {

  const scrollToSection = (id) => {
    const el = document.getElementById(id)
    if (!el) return
    const headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 0
    const chipsBar = document.querySelector('.menu-feed__chips-wrap')
    const chipsH   = chipsBar ? chipsBar.offsetHeight : 48
    const top = el.getBoundingClientRect().top + window.scrollY - headerH - chipsH - 8
    window.scrollTo({ top, behavior: 'smooth' })
  }

  if (!products.length) {
    return (
      <div className="menu-feed__empty">
        <span>✦</span>
        <p>La carta está vacía por el momento</p>
      </div>
    )
  }

  const grouped = groupByCategory(products)
  const availableIds = new Set(
    Object.keys(grouped).map(c => c.toLowerCase().replace(/\s+/g, '-'))
  )
  const chips = CATEGORY_CHIPS.filter(c => availableIds.has(c.id))

  return (
    <div className="menu-feed">

      {chips.length > 1 && (
        <div
          className="menu-feed__chips-wrap"
          style={{ top: 'var(--header-height, 0px)' }}
        >
          <div className="menu-feed__chips">
            {chips.map(chip => (
              <button
                key={chip.id}
                className="menu-feed__chip"
                onClick={() => scrollToSection(chip.id)}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {Object.entries(grouped).map(([category, items], groupIndex) => {
        const sectionId = category.toLowerCase().replace(/\s+/g, '-')
        return (
          <section
            key={category}
            id={sectionId}
            className="menu-feed__section"
            style={{ animationDelay: `${groupIndex * 0.1}s` }}
          >
            <SectionDivider title={category.toUpperCase()} />
            <div className="menu-feed__grid">
              {items.map((product, i) => (
                <div key={product._id} style={{ animationDelay: `${groupIndex * 0.1 + i * 0.07}s` }}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
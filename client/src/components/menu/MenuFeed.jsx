import ProductCard from './ProductCard.jsx'
import './MenuFeed.css'

// Orden fijo de categorías
const CATEGORY_ORDER = ['Cocktails', 'Tragos', 'Cervezas', 'Vinos', 'Picadas', 'Sin alcohol']

function groupByCategory(products) {
  const groups = {}
  products.forEach(p => {
    const cat = p.category || 'Otros'
    if (!groups[cat]) groups[cat] = []
    groups[cat].push(p)
  })

  // Ordenar según CATEGORY_ORDER, el resto al final
  const sorted = {}
  CATEGORY_ORDER.forEach(cat => {
    if (groups[cat]) sorted[cat] = groups[cat]
  })
  Object.keys(groups).forEach(cat => {
    if (!sorted[cat]) sorted[cat] = groups[cat]
  })

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
  if (!products.length) {
    return (
      <div className="menu-feed__empty">
        <span>✦</span>
        <p>La carta está vacía por el momento</p>
      </div>
    )
  }

  const grouped = groupByCategory(products)

  return (
    <div className="menu-feed">
      {Object.entries(grouped).map(([category, items], groupIndex) => (
        <section
          key={category}
          className="menu-feed__section"
          style={{ animationDelay: `${groupIndex * 0.1}s` }}
        >
          <SectionDivider title={category.toUpperCase()} />

          <div className="menu-feed__grid">
            {items.map((product, i) => (
              <div
                key={product._id}
                style={{ animationDelay: `${groupIndex * 0.1 + i * 0.07}s` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
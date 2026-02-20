import { useState } from 'react'
import { useProducts } from '../../hooks/useProducts.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { productsApi } from '../../services/api.js'
import ProductForm from './ProductForm.jsx'
import './AdminDashboard.css'

const CATEGORY_EMOJI = {
  'Cocktails':   '🍸',
  'Tragos':      '🍹',
  'Cervezas':    '🍺',
  'Vinos':       '🍷',
  'Picadas':     '🧀',
  'Sin alcohol': '🫧',
}

export default function AdminDashboard() {
  const { products, loading, error, refetch } = useProducts()
  const { token } = useAuth()

  const [formOpen, setFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [feedback, setFeedback] = useState(null) // { type: 'ok'|'error', msg }
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('Todas')

  const showFeedback = (type, msg) => {
    setFeedback({ type, msg })
    setTimeout(() => setFeedback(null), 3000)
  }

  const handleCreate = () => {
    setEditingProduct(null)
    setFormOpen(true)
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setFormOpen(true)
  }

  const handleSave = async (data) => {
    setSaving(true)
    try {
      if (editingProduct) {
        await productsApi.update(editingProduct._id, data, token)
        showFeedback('ok', 'Producto actualizado correctamente')
      } else {
        await productsApi.create(data, token)
        showFeedback('ok', 'Producto creado correctamente')
      }
      setFormOpen(false)
      refetch()
    } catch (err) {
      showFeedback('error', err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await productsApi.delete(id, token)
      showFeedback('ok', 'Producto eliminado')
      setDeleteId(null)
      refetch()
    } catch (err) {
      showFeedback('error', err.message)
      setDeleteId(null)
    }
  }

  // Filtros
  const categories = ['Todas', ...new Set(products.map(p => p.category))]
  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchCat = filterCat === 'Todas' || p.category === filterCat
    return matchSearch && matchCat
  })

  return (
    <div className="admin-dashboard">

      {/* Feedback toast */}
      {feedback && (
        <div className={`admin-toast ${feedback.type === 'ok' ? 'admin-toast--ok' : 'admin-toast--error'}`}>
          {feedback.type === 'ok' ? '✓' : '⚠️'} {feedback.msg}
        </div>
      )}

      {/* Toolbar */}
      <div className="admin-toolbar">
        <div className="admin-toolbar__left">
          <input
            className="admin-search"
            placeholder="Buscar producto..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="admin-filter"
            value={filterCat}
            onChange={e => setFilterCat(e.target.value)}
          >
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <button className="admin-btn-new" onClick={handleCreate}>
          + NUEVO PRODUCTO
        </button>
      </div>

      {/* Stats rápidas */}
      <div className="admin-stats">
        <div className="admin-stat">
          <span className="admin-stat__num">{products.length}</span>
          <span className="admin-stat__label">PRODUCTOS</span>
        </div>
        <div className="admin-stat">
          <span className="admin-stat__num">{categories.length - 1}</span>
          <span className="admin-stat__label">CATEGORÍAS</span>
        </div>
        <div className="admin-stat">
          <span className="admin-stat__num">{filtered.length}</span>
          <span className="admin-stat__label">FILTRADOS</span>
        </div>
      </div>

      {/* Loading / Error */}
      {loading && (
        <div className="admin-loading">
          <div className="admin-spinner" />
          cargando productos...
        </div>
      )}

      {error && (
        <div className="admin-error">⚠️ {error}</div>
      )}

      {/* Tabla */}
      {!loading && !error && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>PRODUCTO</th>
                <th>CATEGORÍA</th>
                <th>PRECIO</th>
                <th>STOCK</th>
                <th>MEDIA</th>
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="admin-table__empty">
                    No hay productos que coincidan
                  </td>
                </tr>
              )}
              {filtered.map(product => (
                <tr key={product._id}>
                  <td>
                    <div className="admin-table__name">{product.name}</div>
                    <div className="admin-table__desc">{product.description}</div>
                  </td>
                  <td>
                    <span className="admin-badge">
                      {CATEGORY_EMOJI[product.category] || '✦'} {product.category}
                    </span>
                  </td>
                  <td className="admin-table__price">
                    ${product.price.toLocaleString('es-AR')}
                  </td>
                  <td className="admin-table__stock">
                    {product.stock}
                  </td>
                  <td>
                    <div className="admin-table__media">
                      {product.image ? (
                        <img src={product.image} alt="" className="admin-table__thumb" onError={e => e.target.style.display='none'} />
                      ) : (
                        <span className="admin-table__no-media">—</span>
                      )}
                      {product.video ? (
                        <span className="admin-table__has-gif">GIF ✓</span>
                      ) : null}
                    </div>
                  </td>
                  <td>
                    <div className="admin-table__actions">
                      <button
                        className="admin-action admin-action--edit"
                        onClick={() => handleEdit(product)}
                      >
                        ✎ editar
                      </button>
                      {deleteId === product._id ? (
                        <div className="admin-confirm">
                          <span>¿Eliminar?</span>
                          <button
                            className="admin-action admin-action--confirm"
                            onClick={() => handleDelete(product._id)}
                          >
                            sí
                          </button>
                          <button
                            className="admin-action admin-action--cancel"
                            onClick={() => setDeleteId(null)}
                          >
                            no
                          </button>
                        </div>
                      ) : (
                        <button
                          className="admin-action admin-action--delete"
                          onClick={() => setDeleteId(product._id)}
                        >
                          ✕ borrar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal formulario */}
      {formOpen && (
        <ProductForm
          product={editingProduct}
          onSave={handleSave}
          onCancel={() => setFormOpen(false)}
          loading={saving}
        />
      )}

      {/* Confirm delete overlay extra */}
    </div>
  )
}
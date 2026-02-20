import { useState, useEffect } from 'react'
import './ProductForm.css'

const CATEGORIES = ['Cocktails', 'Tragos', 'Cervezas', 'Vinos', 'Picadas', 'Sin alcohol']

const EMPTY_FORM = {
  name: '',
  price: '',
  stock: '',
  description: '',
  category: 'Cocktails',
  image: '',
  video: ''
}

export default function ProductForm({ product, onSave, onCancel, loading }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})

  // Si viene un producto para editar, lo cargamos
  useEffect(() => {
    if (product) {
      setForm({
        name:        product.name        || '',
        price:       product.price       ?? '',
        stock:       product.stock       ?? '',
        description: product.description || '',
        category:    product.category    || 'Cocktails',
        image:       product.image       || '',
        video:       product.video       || ''
      })
    } else {
      setForm(EMPTY_FORM)
    }
  }, [product])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    // Limpiar error del campo tocado
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }))
  }

  const validate = () => {
    const errs = {}
    if (!form.name || form.name.length < 4)
      errs.name = 'Mínimo 4 caracteres'
    if (form.price === '' || Number(form.price) < 0)
      errs.price = 'Precio inválido'
    if (form.stock === '' || !Number.isInteger(Number(form.stock)) || Number(form.stock) < 0)
      errs.stock = 'Stock inválido'
    if (!form.description)
      errs.description = 'Requerida'
    if (!form.category)
      errs.category = 'Requerida'
    return errs
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    onSave({
      ...form,
      price: Number(form.price),
      stock: Number(form.stock)
    })
  }

  return (
    <div className="product-form__overlay">
      <div className="product-form__modal">

        <div className="product-form__header">
          <h3 className="product-form__title">
            {product ? 'EDITAR PRODUCTO' : 'NUEVO PRODUCTO'}
          </h3>
          <button className="product-form__close" onClick={onCancel}>✕</button>
        </div>

        <div className="product-form__topline" />

        <form className="product-form__body" onSubmit={handleSubmit}>

          {/* Nombre */}
          <div className="product-form__field">
            <label className="product-form__label">NOMBRE</label>
            <input
              className={`product-form__input ${errors.name ? 'product-form__input--error' : ''}`}
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Ej: Negroni Clásico"
            />
            {errors.name && <span className="product-form__error">{errors.name}</span>}
          </div>

          {/* Precio + Stock */}
          <div className="product-form__row">
            <div className="product-form__field">
              <label className="product-form__label">PRECIO ($)</label>
              <input
                className={`product-form__input ${errors.price ? 'product-form__input--error' : ''}`}
                name="price"
                type="number"
                min="0"
                value={form.price}
                onChange={handleChange}
                placeholder="2800"
              />
              {errors.price && <span className="product-form__error">{errors.price}</span>}
            </div>

            <div className="product-form__field">
              <label className="product-form__label">STOCK</label>
              <input
                className={`product-form__input ${errors.stock ? 'product-form__input--error' : ''}`}
                name="stock"
                type="number"
                min="0"
                value={form.stock}
                onChange={handleChange}
                placeholder="50"
              />
              {errors.stock && <span className="product-form__error">{errors.stock}</span>}
            </div>
          </div>

          {/* Categoría */}
          <div className="product-form__field">
            <label className="product-form__label">CATEGORÍA</label>
            <select
              className="product-form__input product-form__select"
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Descripción */}
          <div className="product-form__field">
            <label className="product-form__label">DESCRIPCIÓN</label>
            <textarea
              className={`product-form__input product-form__textarea ${errors.description ? 'product-form__input--error' : ''}`}
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describí el producto..."
              rows={3}
            />
            {errors.description && <span className="product-form__error">{errors.description}</span>}
          </div>

          {/* Imagen URL */}
          <div className="product-form__field">
            <label className="product-form__label">IMAGEN (URL)</label>
            <input
              className="product-form__input"
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="https://i.imgur.com/..."
            />
            {form.image && (
              <img
                src={form.image}
                alt="preview"
                className="product-form__preview"
                onError={e => e.target.style.display = 'none'}
              />
            )}
          </div>

          {/* Video/GIF URL */}
          <div className="product-form__field">
            <label className="product-form__label">VIDEO / GIF (URL)</label>
            <input
              className="product-form__input"
              name="video"
              value={form.video}
              onChange={handleChange}
              placeholder="https://i.imgur.com/....gif"
            />
            {form.video && (
              <img
                src={form.video}
                alt="preview gif"
                className="product-form__preview"
                onError={e => e.target.style.display = 'none'}
              />
            )}
          </div>

          {/* Acciones */}
          <div className="product-form__actions">
            <button
              type="button"
              className="product-form__btn product-form__btn--cancel"
              onClick={onCancel}
            >
              CANCELAR
            </button>
            <button
              type="submit"
              className="product-form__btn product-form__btn--save"
              disabled={loading}
            >
              {loading ? 'GUARDANDO...' : product ? 'GUARDAR CAMBIOS' : 'CREAR PRODUCTO'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}
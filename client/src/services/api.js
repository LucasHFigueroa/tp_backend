import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' }
})

// Helper para parsear errores de validación
const parseError = (error) => {
  const data = error.response?.data
  if (!data) throw new Error(error.message)
  if (typeof data.error === 'object') {
    throw new Error(Object.values(data.error).flat().join('. '))
  }
  throw new Error(data.error || 'Error desconocido')
}

// === PRODUCTS ===
export const productsApi = {
  getAll: async () => {
    try {
      const { data } = await api.get('/products')
      return data.data
    } catch (error) {
      parseError(error)
    }
  },

  create: async (product, token) => {
    try {
      const { data } = await api.post('/products', product, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return data.data
    } catch (error) {
      parseError(error)
    }
  },

  update: async (id, updates, token) => {
    try {
      const { data } = await api.patch(`/products/${id}`, updates, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return data.data
    } catch (error) {
      parseError(error)
    }
  },

  delete: async (id, token) => {
    try {
      const { data } = await api.delete(`/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return data.data
    } catch (error) {
      parseError(error)
    }
  }
}

// === AUTH ===
export const authApi = {
  login: async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password })
      return data.data
    } catch (error) {
      parseError(error)
    }
  },

  register: async (email, password) => {
    try {
      const { data } = await api.post('/auth/register', { email, password })
      return data.data
    } catch (error) {
      parseError(error)
    }
  }
}
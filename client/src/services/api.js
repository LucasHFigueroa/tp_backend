const BASE_URL = import.meta.env.VITE_API_URL

async function request(endpoint, options = {}) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options
  })
  const data = await res.json()
  if (!data.success) {
    const msg = typeof data.error === 'object'
      ? Object.values(data.error).flat().join('. ')
      : data.error || 'Error desconocido'
    throw new Error(msg)
  }
  return data.data
}

export const productsApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return request(`/products${query ? `?${query}` : ''}`)
  },

  create: (product, token) =>
    request('/products', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(product)
    }),

  update: (id, updates, token) =>
    request(`/products/${id}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(updates)
    }),

  delete: (id, token) =>
    request(`/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
}

export const authApi = {
  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),

  register: (email, password) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    })
}
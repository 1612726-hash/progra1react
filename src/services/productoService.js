import apiClient from './apiClient';

const BASE = '/productos';

export const productoService = {
  /** GET /api/productos o GET /api/productos?categoriaId=... */
  getAll: (categoriaId = null) => {
    const params = categoriaId ? { categoriaId } : {};
    return apiClient.get(BASE, { params }).then(r => r.data);
  },

  /** GET /api/productos/paginado?page=0&size=10&categoriaId=...&search=...&sortField=...&sortDirection=... */
  getPaginated: (params = {}) => {
    return apiClient.get(`${BASE}/paginado`, { params }).then(r => r.data);
  },

  /** GET /api/productos/:id */
  getById: (id) => apiClient.get(`${BASE}/${id}`).then(r => r.data),

  /** GET /api/productos/codigo/:codigo */
  getByCodigo: (codigo) =>
    apiClient.get(`${BASE}/codigo/${codigo}`).then(r => r.data),

  /** POST /api/productos */
  create: (producto) => apiClient.post(BASE, producto).then(r => r.data),

  /** PUT /api/productos/:id */
  update: (id, producto) => apiClient.put(`${BASE}/${id}`, producto).then(r => r.data),

  /** DELETE /api/productos/:id */
  remove: (id) => apiClient.delete(`${BASE}/${id}`),
};

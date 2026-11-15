import apiClient from './apiClient';

const BASE = '/categorias';

export const categoriaService = {
  /** GET /api/categorias */
  getAll: () => apiClient.get(BASE).then(r => r.data),

  /** GET /api/categorias/:id */
  getById: (id) => apiClient.get(`${BASE}/${id}`).then(r => r.data),

  /** POST /api/categorias */
  create: (categoria) => apiClient.post(BASE, categoria).then(r => r.data),

  /** PUT /api/categorias/:id */
  update: (id, categoria) => apiClient.put(`${BASE}/${id}`, categoria).then(r => r.data),

  /** DELETE /api/categorias/:id */
  remove: (id) => apiClient.delete(`${BASE}/${id}`),
};

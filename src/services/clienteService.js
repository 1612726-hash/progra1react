import apiClient from './apiClient';

const BASE = '/clientes';

export const clienteService = {
  /** GET /api/clientes */
  getAll: () => apiClient.get(BASE).then(r => r.data),

  /** GET /api/clientes/:id */
  getById: (id) => apiClient.get(`${BASE}/${id}`).then(r => r.data),

  /** GET /api/clientes/documento/:doc */
  getByDocumento: (documento) =>
    apiClient.get(`${BASE}/documento/${documento}`).then(r => r.data),

  /** POST /api/clientes */
  create: (cliente) => apiClient.post(BASE, cliente).then(r => r.data),

  /** PUT /api/clientes/:id */
  update: (id, cliente) => apiClient.put(`${BASE}/${id}`, cliente).then(r => r.data),

  /** DELETE /api/clientes/:id */
  remove: (id) => apiClient.delete(`${BASE}/${id}`),
};

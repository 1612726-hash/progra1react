import apiClient from './apiClient';

/**
 * Consulta la lista de facturas (compras y rentas) desde la API del backend
 * @param {string|null} tipo - 'COMPRA', 'RENTA' o null para todas
 * @returns {Promise<Array<object>>}
 */
export const fetchFacturas = async (tipo = null) => {
  try {
    const params = tipo ? { tipo } : {};
    const response = await apiClient.get('/usuarios/facturas', { params });
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error al consultar facturas desde la API:', error);
    throw error;
  }
};

/**
 * Consulta las facturas emitidas por un usuario específico
 * @param {number} usuarioId
 * @returns {Promise<Array<object>>}
 */
export const fetchFacturasByUsuario = async (usuarioId) => {
  try {
    const response = await apiClient.get(`/usuarios/${usuarioId}/facturas`);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error al consultar facturas del usuario:', error);
    throw error;
  }
};

/**
 * Consulta la lista de usuarios y cajeros registrados en el backend
 * @returns {Promise<Array<object>>}
 */
export const fetchUsers = async () => {
  try {
    const response = await apiClient.get('/usuarios');
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error al consultar usuarios desde la API:', error);
    throw error;
  }
};

/**
 * Registra una nueva factura (Compra o Renta) en la API del backend
 * @param {object} venta
 * @returns {Promise<object>}
 */
export const createFactura = async (venta) => {
  try {
    const response = await apiClient.post('/ventas', venta);
    return response.data;
  } catch (error) {
    console.error('Error al registrar factura:', error);
    throw error;
  }
};

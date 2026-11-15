/**
 * Instancia de axios centralizada con interceptores para:
 *  - Inyectar el token JWT en cada petición
 *  - Redirigir al login si el token expira (401)
 */
import axios from 'axios';
import { getItem, removeItem } from '../utils/storageUtil';
import { AUTH_STORAGE_KEY } from '../constants/authConstants';

const apiClient = axios.create({
  // Gracias al proxy de Vite, /api/* se redirige a http://localhost:8080
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 10000,
});

// ── Interceptor de REQUEST ──────────────────────────────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    const session = getItem(AUTH_STORAGE_KEY, null);
    if (session?.token) {
      if (session.token === 'mock-token-dummy') {
        // Credenciales administrativas básicas por defecto para que las APIs del backend funcionen
        config.headers.Authorization = 'Basic ' + btoa('admin:admin1234');
      } else if (session.token.startsWith('Basic ') || session.token.startsWith('Bearer ')) {
        config.headers.Authorization = session.token;
      } else {
        config.headers.Authorization = `Basic ${session.token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Interceptor de RESPONSE ─────────────────────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginEndpoint = error.config?.url?.includes('/auth/login');
    const session = getItem(AUTH_STORAGE_KEY, null);

    // Solo redirigir si NO es el endpoint de login y ya había una sesión activa que expiró
    if (error.response?.status === 401 && !isLoginEndpoint && session?.token) {
      removeItem(AUTH_STORAGE_KEY);
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

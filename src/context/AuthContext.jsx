/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from 'react';
import { AUTH_STORAGE_KEY, DEFAULT_AUTH_CREDENTIALS } from '../constants/authConstants';
import { getItem, setItem, removeItem } from '../utils/storageUtil';
import { authenticateUser } from '../services/authService';

export const AuthContext = createContext({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  login: async () => {},
  logout: () => {}
});

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(() => {
    const saved = getItem(AUTH_STORAGE_KEY, null);
    const sesionVigente =
      saved &&
      saved.token &&
      saved.user?.username === DEFAULT_AUTH_CREDENTIALS.username;
    if (sesionVigente) {
      return {
        user: saved.user,
        token: saved.token,
        isAuthenticated: true
      };
    }
    removeItem(AUTH_STORAGE_KEY);
    return {
      user: null,
      token: null,
      isAuthenticated: false
    };
  });

  const [isLoading, setIsLoading] = useState(false);

  /**
   * Valida las credenciales del jugador autorizado y autentica contra el
   * backend Spring Boot para obtener el token de las peticiones.
   * @param {string} username
   * @param {string} password
   */
  const login = async (username, password) => {
    const credencialesValidas =
      username.trim() === DEFAULT_AUTH_CREDENTIALS.username &&
      password === DEFAULT_AUTH_CREDENTIALS.password;

    if (!credencialesValidas) {
      return { success: false, message: 'Usuario o contraseña incorrectos. Solo personal autorizado.' };
    }

    setIsLoading(true);
    try {
      const response = await authenticateUser(username.trim(), password);

      const sessionData = {
        user: response.user,
        token: response.token,
        isAuthenticated: true
      };

      setItem(AUTH_STORAGE_KEY, sessionData);
      setAuthState(sessionData);
      return { success: true };
    } catch (backendError) {
      console.error('Error al autenticar contra el backend:', backendError);

      const serverMsg = backendError.response?.data?.mensaje;
      let userMsg = serverMsg;

      if (!userMsg) {
        if (backendError.code === 'ECONNABORTED') {
          userMsg = 'Tiempo de espera agotado. El backend no respondió a tiempo.';
        } else if (!backendError.response) {
          userMsg = 'No se pudo conectar con el servidor backend (puerto 8080). Asegúrate de que el backend esté iniciado.';
        } else if (backendError.response.status === 401) {
          userMsg = 'Credenciales inválidas: usuario o contraseña incorrectos.';
        } else {
          userMsg = `Error del servidor (${backendError.response.status}).`;
        }
      }

      return { success: false, message: userMsg };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    removeItem(AUTH_STORAGE_KEY);
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user: authState.user,
        token: authState.token,
        isAuthenticated: authState.isAuthenticated,
        isLoading,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

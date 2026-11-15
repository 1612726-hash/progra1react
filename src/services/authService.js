import apiClient from './apiClient';

/**
 * Autentica un usuario contra el backend Spring Boot.
 * POST /api/auth/login  →  { username, password }
 *
 * @param {string} username
 * @param {string} password
 * @returns {Promise<{ user: object, token: string, roles: string[] }>}
 */
export const authenticateUser = async (username, password) => {
  const response = await apiClient.post(
    '/auth/login',
    { username, password },
    { timeout: 10000 }
  );
  const data = response.data;

  // data = { token, username, roles, mensaje, success }
  const token = data.token || ('Basic ' + btoa(`${username}:${password}`));

  return {
    token,
    user: {
      id: null,
      name: data.username,
      username: data.username,
      role: data.roles?.[0] ?? 'ROLE_ADMIN',
      roles: data.roles ?? ['ROLE_ADMIN'],
      avatar: null,
    },
  };
};

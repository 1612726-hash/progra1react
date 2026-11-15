/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} email
 * @property {string} name
 * @property {string} role
 */

/**
 * @typedef {Object} AuthState
 * @property {User|null} user
 * @property {boolean} isAuthenticated
 * @property {string|null} token
 */

/**
 * @typedef {'lara-light-indigo' | 'lara-dark-indigo'} ThemeMode
 */

export const USER_ROLES = {
  ADMIN: 'ADMIN',
  OPERATOR: 'OPERATOR',
  VIEWER: 'VIEWER'
};

/**
 * Token utility — centralized localStorage access for JWT token.
 * Single source of truth for token storage/retrieval/removal.
 */
const TOKEN_KEY = 'fundoo_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);

export const removeToken = () => localStorage.removeItem(TOKEN_KEY);

export const isAuthenticated = () => !!getToken();

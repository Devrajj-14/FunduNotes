import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser, logoutUser } from '../services/authService';
import { setToken, removeToken, isAuthenticated } from '../utils/token';

/**
 * Custom hook for authentication logic.
 * Manages login, register, logout flows with loading/error state.
 */
export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const login = useCallback(async (credentials) => {
    setLoading(true);
    setError('');
    try {
      const res = await loginUser(credentials);
      setToken(res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const register = useCallback(async (userData) => {
    setLoading(true);
    setError('');
    try {
      await registerUser(userData);
      return true; // success
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch {
      // Even if backend call fails, clear token locally
    } finally {
      removeToken();
      navigate('/login');
    }
  }, [navigate]);

  return { login, register, logout, loading, error, setError, isAuthenticated: isAuthenticated() };
}

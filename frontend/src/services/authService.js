import apiClient from '../utils/apiClient';

/**
 * Auth service — all user authentication API calls.
 * Matches backend: /api/users/*
 */

export const registerUser = (data) =>
  apiClient.post('/api/users/register', data);

export const loginUser = (data) =>
  apiClient.post('/api/users/login', data);

export const forgotPassword = (data) =>
  apiClient.post('/api/users/forgot-password', data);

export const resetPassword = (data) =>
  apiClient.post('/api/users/reset-password', data);

export const logoutUser = () =>
  apiClient.post('/api/users/logout');

import { apiClient } from './apiClient';

export const authService = {
  login: (credentials) => apiClient('/auth/login', { body: credentials }),
  register: (userData) => apiClient('/auth/register', { body: userData }),
  getMe: () => apiClient('/auth/me'),
  updateProfile: (profile) => apiClient('/auth/profile', { method: 'PUT', body: profile }),
};


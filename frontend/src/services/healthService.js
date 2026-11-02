import { apiClient } from './apiClient';

export const healthService = {
  getHealth: () => apiClient('/health'),
};


import { apiClient } from './apiClient';

export const dashboardService = {
  getDashboardStats: () => apiClient('/dashboard/stats'),
};


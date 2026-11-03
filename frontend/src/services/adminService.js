import { apiClient } from './apiClient';

export const adminService = {
  getMetrics: () => apiClient('/admin/metrics'),
  listUsers: (search = '') =>
    apiClient(`/admin/users${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  updateUserRole: (id, role) =>
    apiClient(`/admin/users/${id}/role`, {
      method: 'PUT',
      body: { role },
    }),
  deleteUser: (id) =>
    apiClient(`/admin/users/${id}`, {
      method: 'DELETE',
    }),
  getAdminControllers: () => apiClient('/admin/controllers'),
  getAdminChapters: () => apiClient('/admin/chapters'),
  getAdminQuizzes: () => apiClient('/admin/quizzes'),
};


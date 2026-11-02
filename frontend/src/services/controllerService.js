import { apiClient } from './apiClient';

export const controllerService = {
  getControllers: (params = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        searchParams.append(key, val);
      }
    });
    const qs = searchParams.toString();
    return apiClient(`/controllers${qs ? `?${qs}` : ''}`);
  },
  getFeaturedControllers: () => apiClient('/controllers/featured'),
  getControllerById: (id) => apiClient(`/controllers/${id}`),
  compareControllers: (ids) => apiClient(`/controllers/compare?ids=${ids.join(',')}`),
};


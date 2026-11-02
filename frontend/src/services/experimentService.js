import { apiClient } from './apiClient';

export const experimentService = {
  getSavedExperiments: () => apiClient('/experiments'),
  getExperimentById: (id) => apiClient(`/experiments/${id}`),
  saveExperiment: (data) => apiClient('/experiments', { body: data }),
  updateExperiment: (id, data) => apiClient(`/experiments/${id}`, { method: 'PUT', body: data }),
  deleteExperiment: (id) => apiClient(`/experiments/${id}`, { method: 'DELETE' }),
};


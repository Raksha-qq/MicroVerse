import { apiClient } from './apiClient';

export const researchNoteService = {
  getNotes: (params = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        searchParams.append(key, val);
      }
    });
    const qs = searchParams.toString();
    return apiClient(`/research-notes${qs ? `?${qs}` : ''}`);
  },
  getNoteById: (id) => apiClient(`/research-notes/${id}`),
  createNote: (data) => apiClient('/research-notes', { body: data }),
  updateNote: (id, data) => apiClient(`/research-notes/${id}`, { method: 'PUT', body: data }),
  deleteNote: (id) => apiClient(`/research-notes/${id}`, { method: 'DELETE' }),
};


import { apiClient } from './apiClient';

export const lessonService = {
  getLessons: () => apiClient('/lessons'),
  getLessonBySlugOrId: (slugOrId) => apiClient(`/lessons/${slugOrId}`),
  completeLesson: (id) => apiClient(`/lessons/${id}/complete`, { method: 'POST' }),
  getChapters: () => apiClient('/chapters'),
  getChapterBySlug: (slug) => apiClient(`/chapters/${slug}`),
};


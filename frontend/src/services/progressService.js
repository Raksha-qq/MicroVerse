import { apiClient } from './apiClient';

export const progressService = {
  getProgress: () => apiClient('/progress'),
  markChapterCompleted: (chapterId) => apiClient(`/progress/chapter/${chapterId}`, { method: 'POST' }),
  markLessonCompleted: (lessonId) => apiClient(`/progress/lesson/${lessonId}`, { method: 'POST' }),
};


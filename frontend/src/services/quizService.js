import { apiClient } from './apiClient';

export const quizService = {
  getAllQuizzes: () => apiClient('/quizzes'),
  getQuizByChapter: (chapterId) => apiClient(`/quizzes/chapter/${chapterId}`),
  getQuizById: (id) => apiClient(`/quizzes/${id}`),
  submitQuiz: (quizId, answers) =>
    apiClient(`/quizzes/${quizId}/submit`, {
      body: { answers },
    }),
  getUserAttempts: () => apiClient('/quizzes/attempts'),
};

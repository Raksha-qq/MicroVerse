import { apiClient } from './apiClient';

export const quizService = {
  getQuizByChapter: (chapterId) => apiClient(`/quizzes/chapter/${chapterId}`),
  submitQuiz: (quizId, answers) => apiClient(`/quizzes/${quizId}/submit`, { body: { answers } }),
};


const BASE_URL = import.meta.env.VITE_API_URL || 'https://microverse-api-34pc.onrender.com/api';

export async function apiClient(endpoint, { body, ...customConfig } = {}) {
  const token = localStorage.getItem('microverse_token');
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    method: body ? 'POST' : 'GET',
    // Cross-origin authentication uses the bearer token header rather than cookies.
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401 && token) {
        localStorage.removeItem('microverse_token');
        window.dispatchEvent(new Event('auth-expired'));
      }
      throw new Error(data.error || data.message || 'Laboratory communication error');
    }

    return data;
  } catch (err) {
    if (err instanceof SyntaxError) {
      throw new Error('Server returned an invalid response. The backend may be starting up — please try again in a moment.');
    }
    return Promise.reject(err);
  }
}

// API methods
export const api = {
  // Auth
  login: (credentials) => apiClient('/auth/login', { body: credentials }),
  register: (userData) => apiClient('/auth/register', { body: userData }),
  getMe: () => apiClient('/auth/me'),
  updateProfile: (profile) => apiClient('/auth/profile', { method: 'PUT', body: profile }),

  // Controllers
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
  createController: (data) => apiClient('/controllers', { body: data }),
  updateController: (id, data) => apiClient(`/controllers/${id}`, { method: 'PUT', body: data }),
  deleteController: (id) => apiClient(`/controllers/${id}`, { method: 'DELETE' }),

  // Chapters & Curriculum
  getChapters: () => apiClient('/chapters'),
  getChapterBySlug: (slug) => apiClient(`/chapters/${slug}`),
  completeChapter: (id) => apiClient(`/chapters/${id}/complete`, { method: 'POST' }),
  createChapter: (data) => apiClient('/chapters', { body: data }),
  updateChapter: (id, data) => apiClient(`/chapters/${id}`, { method: 'PUT', body: data }),
  deleteChapter: (id) => apiClient(`/chapters/${id}`, { method: 'DELETE' }),

  // Quizzes
  getQuizByChapter: (chapterId) => apiClient(`/quizzes/chapter/${chapterId}`),
  submitQuiz: (quizId, answers) => apiClient(`/quizzes/${quizId}/submit`, { body: { answers } }),
  addQuizQuestion: (data) => apiClient('/quizzes/question', { body: data }),

  // Experiments
  getSavedExperiments: () => apiClient('/experiments'),
  getExperimentById: (id) => apiClient(`/experiments/${id}`),
  saveExperiment: (data) => apiClient('/experiments', { body: data }),
  updateExperiment: (id, data) => apiClient(`/experiments/${id}`, { method: 'PUT', body: data }),
  deleteExperiment: (id) => apiClient(`/experiments/${id}`, { method: 'DELETE' }),

  // Bookmarks
  getBookmarks: () => apiClient('/bookmarks'),
  toggleBookmark: (itemType, itemId) =>
    apiClient('/bookmarks/toggle', { body: { itemType, itemId } }),

  // Dashboard & Admin
  getDashboardStats: () => apiClient('/dashboard/stats'),
  getAdminMetrics: () => apiClient('/admin/metrics'),
  getAdminUsers: (search = '') => apiClient(`/admin/users${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  updateUserRole: (id, role) => apiClient(`/admin/users/${id}/role`, { method: 'PUT', body: { role } }),
};

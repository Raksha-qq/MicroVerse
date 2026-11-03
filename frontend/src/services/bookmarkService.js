import { apiClient } from './apiClient';

export const bookmarkService = {
  getBookmarks: () => apiClient('/bookmarks'),
  toggleBookmark: (itemType, itemId) =>
    apiClient('/bookmarks/toggle', {
      body: { itemType, itemId },
    }),
  removeBookmark: (id) =>
    apiClient(`/bookmarks/${id}`, {
      method: 'DELETE',
    }),
};


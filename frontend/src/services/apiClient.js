const BASE_URL = '/api';

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
      throw new Error(data.error || 'Laboratory communication error');
    }

    return data;
  } catch (err) {
    return Promise.reject(err);
  }
}


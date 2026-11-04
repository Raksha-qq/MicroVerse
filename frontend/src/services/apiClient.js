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

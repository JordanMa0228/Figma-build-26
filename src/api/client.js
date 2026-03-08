// src/api/client.js
// Central API client — automatically uses Railway URL in production, localhost in dev

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const apiClient = {
  /**
   * Make a GET request to the API
   */
  async get(endpoint, token = null) {
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'GET',
      headers,
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  },

  /**
   * Make a POST request to the API
   */
  async post(endpoint, body, token = null) {
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  },

  /**
   * Check if the API is reachable
   */
  async healthCheck() {
    try {
      const result = await this.get('/api/health');
      return { ok: true, data: result };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  },
};

export default apiClient;

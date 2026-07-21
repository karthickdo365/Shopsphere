import axios from 'axios';

// Kept outside React so the axios interceptor can read/update it without re-renders.
// The AuthContext keeps this in sync with its own state.
export const tokenStore = { accessToken: null };

const api = axios.create({
  baseURL: '/api/v1',
  withCredentials: true, // sends the httpOnly refreshToken cookie
});

api.interceptors.request.use((config) => {
  if (tokenStore.accessToken) {
    config.headers.Authorization = `Bearer ${tokenStore.accessToken}`;
  }
  return config;
});

let refreshPromise = null;

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const { config, response } = error;
    if (response?.status === 401 && !config._retried) {
      config._retried = true;
      try {
        // De-dupe concurrent refresh calls
        refreshPromise = refreshPromise || api.post('/auth/refresh');
        const { data } = await refreshPromise;
        refreshPromise = null;
        tokenStore.accessToken = data.accessToken;
        config.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(config);
      } catch (refreshErr) {
        refreshPromise = null;
        tokenStore.accessToken = null;
        return Promise.reject(refreshErr);
      }
    }
    return Promise.reject(error);
  }
);

export default api;

import axios from "axios";

export const tokenStore = { accessToken: null };

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (tokenStore.accessToken) {
    config.headers.Authorization = `Bearer ${tokenStore.accessToken}`;
  }
  return config;
});

export default api;
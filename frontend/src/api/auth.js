import api, { tokenStore } from './axios';

export const registerUser = async (payload) => {
  const { data } = await api.post('/auth/register', payload);
  tokenStore.accessToken = data.accessToken;
  return data.user;
};

export const loginUser = async (payload) => {
  const { data } = await api.post('/auth/login', payload);
  tokenStore.accessToken = data.accessToken;
  return data.user;
};

export const logoutUser = async () => {
  await api.post('/auth/logout');
  tokenStore.accessToken = null;
};

export const fetchMe = async () => {
  const { data } = await api.get('/auth/me');
  return data.user;
};

export const silentRefresh = async () => {
  const { data } = await api.post('/auth/refresh');
  tokenStore.accessToken = data.accessToken;
  return data.accessToken;
};

export const verifyEmail = async (token) => (await api.post('/auth/verify-email', { token })).data;

export const resendVerification = async () => (await api.post('/auth/resend-verification')).data;

export const forgotPassword = async (email) => (await api.post('/auth/forgot-password', { email })).data;

export const resetPassword = async (token, password) =>
  (await api.post('/auth/reset-password', { token, password })).data;

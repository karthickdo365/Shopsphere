import api from './axios';

export const getBanners = async () => (await api.get('/banners')).data.data;
export const getAllBanners = async () => (await api.get('/banners/all')).data.data;
export const createBanner = async (payload) => (await api.post('/banners', payload)).data.data;
export const updateBanner = async (id, payload) => (await api.put(`/banners/${id}`, payload)).data.data;
export const deleteBanner = async (id) => (await api.delete(`/banners/${id}`)).data;

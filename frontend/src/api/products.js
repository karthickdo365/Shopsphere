import api from './axios';

export const getProducts = async (params = {}) => {
  const { data } = await api.get('/products', { params });
  return data; // { data: [...], pagination }
};

export const getProductBySlug = async (slug) => {
  const { data } = await api.get(`/products/${slug}`);
  return data.data;
};

export const createProduct = async (payload) => (await api.post('/products', payload)).data.data;
export const updateProduct = async (id, payload) => (await api.put(`/products/${id}`, payload)).data.data;
export const deleteProduct = async (id) => (await api.delete(`/products/${id}`)).data;

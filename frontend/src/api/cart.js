import api from './axios';

export const getCart = async () => (await api.get('/cart')).data.data;
export const addToCart = async (productId, quantity = 1, size) =>
  (await api.post('/cart', { productId, quantity, size })).data.data;
export const updateCartItem = async (id, quantity) => (await api.put(`/cart/${id}`, { quantity })).data.data;
export const removeCartItem = async (id) => (await api.delete(`/cart/${id}`)).data;
export const clearCart = async () => (await api.delete('/cart')).data;

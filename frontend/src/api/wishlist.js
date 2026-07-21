import api from './axios';

export const getWishlist = async () => (await api.get('/wishlist')).data.data;
export const addToWishlist = async (productId) => (await api.post('/wishlist', { productId })).data.data;
export const removeFromWishlist = async (productId) => (await api.delete(`/wishlist/${productId}`)).data;

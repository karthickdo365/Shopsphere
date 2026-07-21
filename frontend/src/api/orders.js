import api from './axios';

export const checkout = async (shippingAddress) =>
  (await api.post('/orders/checkout', { shippingAddress })).data.data;

export const verifyPayment = async (payload) =>
  (await api.post('/orders/verify-payment', payload)).data;

export const getMyOrders = async () => (await api.get('/orders')).data.data;
export const getOrderById = async (id) => (await api.get(`/orders/${id}`)).data.data;
export const getAllOrders = async () => (await api.get('/orders/admin/all')).data.data;
export const updateOrderStatus = async (id, status) =>
  (await api.put(`/orders/${id}/status`, { status })).data.data;

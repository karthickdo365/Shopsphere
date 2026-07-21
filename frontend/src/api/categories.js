import api from './axios';

export const getCategories = async () => (await api.get('/categories')).data.data;
export const createCategory = async (payload) => (await api.post('/categories', payload)).data.data;
export const updateCategory = async (id, payload) => (await api.put(`/categories/${id}`, payload)).data.data;
export const deleteCategory = async (id) => (await api.delete(`/categories/${id}`)).data;
export const createSubCategory = async (categoryId, payload) =>
  (await api.post(`/categories/${categoryId}/subcategories`, payload)).data.data;
export const deleteSubCategory = async (id) => (await api.delete(`/categories/subcategories/${id}`)).data;

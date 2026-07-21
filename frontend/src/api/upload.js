import api from './axios';

// Uploads a single image file, returns the public URL string
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  const { data } = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.url;
};

// Uploads multiple image files at once, returns an array of public URLs
export const uploadImages = async (files) => {
  const formData = new FormData();
  Array.from(files).forEach((file) => formData.append('images', file));
  const { data } = await api.post('/upload/multiple', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.urls;
};

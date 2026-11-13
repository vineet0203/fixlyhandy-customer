import apiClient from './client';

export const sendOtp = async (payload) => {
  const res = await apiClient.post('/verification/otp/send', payload);
  return res.data?.data;
};

export const verifyOtp = async (payload) => {
  const res = await apiClient.post('/verification/otp/verify', { type: 'email', ...payload });
  return res.data?.data;
};

export const uploadDocument = async (formData) => {
  const res = await apiClient.post('/verification/document/upload', formData);
  return res.data?.data;
};

export const saveProgress = async (payload) => {
  const res = await apiClient.post('/verification/progress', payload);
  return res.data?.data;
};

export const getProgress = async () => {
  const res = await apiClient.get('/verification/progress');
  return res.data?.data;
};

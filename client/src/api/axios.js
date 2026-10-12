import axios from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || ''}/api`,
  withCredentials: true, // send the httpOnly auth cookie cross-site
  timeout: 20000,
});

// Fallback Bearer token for browsers that block third-party cookies (e.g. Safari)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getErrorMessage = (err) =>
  err.response?.data?.message || (err.code === 'ECONNABORTED' ? 'Request timed out' : err.message) || 'Something went wrong';

export default api;

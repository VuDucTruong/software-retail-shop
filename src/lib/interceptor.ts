// middleware/authInterceptor.ts
import axiosInstance from '@/lib/axios';

axiosInstance.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined'
      ? localStorage.getItem('token')
      : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Global error handler, ví dụ:
    if (error.response?.status === 401) {
      // Redirect to login, toast, logout, etc.
    }
    return Promise.reject(error);
  }
);

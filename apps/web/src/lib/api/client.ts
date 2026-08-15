import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiErrorResponse } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';


export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError<ApiErrorResponse>) => {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 401 && typeof window !== 'undefined') {
        const isAuthPage = window.location.pathname.startsWith('/login') || window.location.pathname.startsWith('/auth');
        if (!isAuthPage) {
          console.warn('[API] Session expired or unauthorized. Redirecting to login...')
          window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
        }
      }

      const backendMessage = data?.error;
      const formattedMessage = Array.isArray(backendMessage)
        ? backendMessage.join(', ')
        : typeof backendMessage === 'string'
          ? backendMessage
          : error.message || 'Bir hata oluştu.';
      error.message = formattedMessage;
    } else if (error.request) {
      error.message = 'Sunucuya ulaşılamıyor. Lütfen internet bağlantınızı kontrol edin.';
    }

    return Promise.reject(error);
  }
);

export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    apiClient.get<T>(url, config).then((res) => res.data),

  post: <T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig) =>
    apiClient.post<T>(url, data, config).then((res) => res.data),

  put: <T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig) =>
    apiClient.put<T>(url, data, config).then((res) => res.data),

  patch: <T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig) =>
    apiClient.patch<T>(url, data, config).then((res) => res.data),

  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    apiClient.delete<T>(url, config).then((res) => res.data),
};

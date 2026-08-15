import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiErrorResponse } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

/**
 * Standard Axios instance configured for InsuraHub
 * - withCredentials: true ensures HttpOnly cookies (JWT/Session) are automatically passed
 * - Interceptors handle error normalization and authentication expiration
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Note: Authentication is handled securely via HttpOnly cookies by the browser.
    // No manual Authorization header injection is required here.
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError<ApiErrorResponse>) => {
    if (error.response) {
      const { status, data } = error.response;

      // Handle Unauthorized (401)
      if (status === 401 && typeof window !== 'undefined') {
        const isAuthPage = window.location.pathname.startsWith('/login') || window.location.pathname.startsWith('/auth');
        if (!isAuthPage) {
          console.warn('[API] Session expired or unauthorized. Redirecting to login...');
          // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- Full page navigation on 401 is required outside React tree to reset all client memory/state
          window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
        }
      }

      // Format custom error message from Backend GlobalExceptionFilter
      const backendMessage = data?.error;
      const formattedMessage = Array.isArray(backendMessage)
        ? backendMessage.join(', ')
        : typeof backendMessage === 'string'
        ? backendMessage
        : error.message || 'Bir hata oluştu.';

      // Attach normalized message for easy access in UI/Toasts
      error.message = formattedMessage;
    } else if (error.request) {
      error.message = 'Sunucuya ulaşılamıyor. Lütfen internet bağlantınızı kontrol edin.';
    }

    return Promise.reject(error);
  }
);

/**
 * Type-safe API Request Helpers
 */
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

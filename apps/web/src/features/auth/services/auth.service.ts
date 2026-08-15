import { api } from '@/lib/api';
import { LoginRequest, LoginResponse } from '@/types/auth.types';

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    return api.post<LoginResponse>('/auth/login', credentials);
  },

  getMe: async (): Promise<LoginResponse> => {
    return api.get<LoginResponse>('/auth/me');
  },

  logout: async (): Promise<{ message: string }> => {
    return api.post<{ message: string }>('/auth/logout');
  },
};

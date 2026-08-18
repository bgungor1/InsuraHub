import { api } from '@/lib/api';
import type {
  User,
  UsersListResponse,
  UsersQueryParams,
  CreateUserInput,
} from '../types/user.types';

export const usersService = {
  async getUsers(params?: UsersQueryParams): Promise<UsersListResponse> {
    return api.get<UsersListResponse>('/users', { params });
  },

  async getUserById(id: string): Promise<User> {
    const response = await api.get<{ data: User }>(`/users/${id}`);
    return response.data;
  },

  async createUser(input: CreateUserInput): Promise<User> {
    const response = await api.post<{ message?: string; data: User }>('/users', input);
    return response.data;
  },

  async updateUser(id: string, input: Partial<CreateUserInput>): Promise<User> {
    const response = await api.patch<{ message?: string; data: User }>(`/users/${id}`, input);
    return response.data;
  },

  async deleteUser(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  },
};

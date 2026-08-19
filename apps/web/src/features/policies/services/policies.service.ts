import { api } from '@/lib/api';
import type {
  Policy,
  PoliciesListResponse,
  PoliciesQueryParams,
  CreatePolicyInput,
} from '../types/policy.types';

export const policiesService = {
  async getPolicies(params?: PoliciesQueryParams): Promise<PoliciesListResponse> {
    return api.get<PoliciesListResponse>('/policies', { params });
  },

  async getPolicyById(id: string): Promise<Policy> {
    const response = await api.get<{ data: Policy }>(`/policies/${id}`);
    return response.data;
  },

  async createPolicy(input: CreatePolicyInput): Promise<Policy> {
    const response = await api.post<{ message: string; data: Policy }>('/policies', input);
    return response.data;
  },

  async updatePolicy(id: string, input: Partial<CreatePolicyInput>): Promise<Policy> {
    const response = await api.patch<{ message: string; data: Policy }>(`/policies/${id}`, input);
    return response.data;
  },

  async claimPolicy(id: string): Promise<Policy> {
    const response = await api.post<{ message: string; data: Policy }>(`/policies/${id}/claim`);
    return response.data;
  },

  async releasePolicy(id: string, reason?: string): Promise<Policy> {
    const response = await api.post<{ message: string; data: Policy }>(`/policies/${id}/release`, { reason });
    return response.data;
  },

  async completePolicy(id: string, totalAmount: number): Promise<Policy> {
    const response = await api.post<{ message: string; data: Policy }>(`/policies/${id}/complete`, { totalAmount });
    return response.data;
  },

  async cancelPolicy(id: string): Promise<Policy> {
    const response = await api.post<{ message: string; data: Policy }>(`/policies/${id}/cancel`);
    return response.data;
  },

  async deletePolicy(id: string): Promise<void> {
    await api.delete(`/policies/${id}`);
  },
};

import { api } from '@/lib/api';
import type {
  CommissionRule,
  CommissionSnapshot,
  CommissionSnapshotsResponse,
  CommissionQueryParams,
  CreateCommissionRuleInput,
} from '../types/commission.types';

export const commissionsService = {
  async getActiveRules(): Promise<CommissionRule[]> {
    const response = await api.get<{ data: CommissionRule[] }>('/commissions/rules/active');
    return response.data;
  },

  async getAllRules(): Promise<CommissionRule[]> {
    const response = await api.get<{ data: CommissionRule[] }>('/commissions/rules');
    return response.data;
  },

  async createRule(input: CreateCommissionRuleInput): Promise<CommissionRule> {
    const response = await api.post<{ message: string; data: CommissionRule }>(
      '/commissions/rules',
      input,
    );
    return response.data;
  },

  async getSnapshots(params?: CommissionQueryParams): Promise<CommissionSnapshotsResponse> {
    return api.get<CommissionSnapshotsResponse>('/commissions/snapshots', { params });
  },

  async getSnapshotByPolicyId(policyId: string): Promise<CommissionSnapshot> {
    const response = await api.get<{ data: CommissionSnapshot }>(
      `/commissions/snapshots/${policyId}`,
    );
    return response.data;
  },

  async calculateForPolicy(policyId: string, totalAmount?: number): Promise<CommissionSnapshot> {
    const response = await api.post<{ message: string; data: CommissionSnapshot }>(
      `/commissions/calculate/${policyId}`,
      { totalAmount },
    );
    return response.data;
  },
};

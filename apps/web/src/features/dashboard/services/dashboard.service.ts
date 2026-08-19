import { api } from '@/lib/api';
import type { DashboardSummary } from '../types/dashboard.types';

export const dashboardService = {
  async getSummary(): Promise<DashboardSummary> {
    const response = await api.get<{ data: DashboardSummary }>('/dashboard/summary');
    return response.data;
  },
};

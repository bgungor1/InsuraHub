import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/api';
import { dashboardService } from '../services/dashboard.service';

export function useDashboardSummaryQuery() {
  return useQuery({
    queryKey: queryKeys.dashboard.summary(),
    queryFn: () => dashboardService.getSummary(),
    staleTime: 30 * 1000,
  });
}

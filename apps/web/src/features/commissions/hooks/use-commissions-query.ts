import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/api';
import { commissionsService } from '../services/commissions.service';
import type { CommissionQueryParams } from '../types/commission.types';

export function useActiveCommissionRulesQuery() {
  return useQuery({
    queryKey: queryKeys.commissions.activeRules(),
    queryFn: () => commissionsService.getActiveRules(),
    staleTime: 60 * 1000,
  });
}

export function useCommissionRulesQuery() {
  return useQuery({
    queryKey: queryKeys.commissions.rules(),
    queryFn: () => commissionsService.getAllRules(),
    staleTime: 60 * 1000,
  });
}

export function useCommissionSnapshotsQuery(params?: CommissionQueryParams) {
  return useQuery({
    queryKey: queryKeys.commissions.snapshots(params as Record<string, unknown>),
    queryFn: () => commissionsService.getSnapshots(params),
    staleTime: 30 * 1000,
  });
}
